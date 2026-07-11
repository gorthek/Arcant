import bpy
import math

def delete_existing_lensing():
    # If the Lensing rings already exist, delete them so we can rerun cleanly
    names = ["LensingRing_Back", "LensingRing_Front"]
    for name in names:
        if name in bpy.data.objects:
            obj = bpy.data.objects[name]
            bpy.data.objects.remove(obj, do_unlink=True)
            
    # Clean up meshes
    for mesh in list(bpy.data.meshes):
        if mesh.name.startswith("LensingRing_Back_Mesh") or mesh.name.startswith("LensingRing_Front_Mesh"):
            bpy.data.meshes.remove(mesh)

def create_glow_material(name, emission_strength=3.0):
    if name in bpy.data.materials:
        mat = bpy.data.materials[name]
    else:
        mat = bpy.data.materials.new(name=name)
        
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    # 1. Attribute Node (vertex colors)
    node_attr = nodes.new(type="ShaderNodeAttribute")
    node_attr.attribute_name = "Color"
    node_attr.location = (-400, 0)
    
    # 2. Emission Node (glow effect)
    node_emission = nodes.new(type="ShaderNodeEmission")
    node_emission.location = (-100, 100)
    node_emission.inputs['Strength'].default_value = emission_strength
    links.new(node_attr.outputs['Color'], node_emission.inputs['Color'])
    
    # 3. Transparent BSDF Node (handles fading borders)
    node_transparent = nodes.new(type="ShaderNodeBsdfTransparent")
    node_transparent.location = (-100, -100)
    
    # 4. Mix Shader Node (blends Transparent and Emission based on vertex Alpha)
    node_mix = nodes.new(type="ShaderNodeMixShader")
    node_mix.location = (150, 0)
    links.new(node_attr.outputs['Alpha'], node_mix.inputs['Factor'])
    links.new(node_transparent.outputs['BSDF'], node_mix.inputs[1])
    links.new(node_emission.outputs['Emission'], node_mix.inputs[2])
    
    # 5. Output Material Node
    node_output = nodes.new(type="ShaderNodeOutputMaterial")
    node_output.location = (350, 0)
    links.new(node_mix.outputs['Shader'], node_output.inputs['Surface'])
    
    # Viewport transparency settings
    mat.blend_method = 'BLEND'
    mat.shadow_method = 'NONE'
    
    return mat

def build_lensing_ring(name, r_min, r_max, n_r, n_theta, y_offset, warp_direction):
    mesh = bpy.data.meshes.new(name=name + "_Mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    vertices = []
    faces = []
    vertex_colors = []
    
    for i in range(n_r):
        t = i / (n_r - 1) if n_r > 1 else 0
        r = r_min + t * (r_max - r_min)
        
        # Calculate color gradient (slightly cooler, orange-rose-purple for lensing contrast)
        if t < 0.2:
            # White-Yellow core
            color = (1.0, 0.9, 0.6, 1.0)
        elif t < 0.6:
            # Rose-Orange
            u = (t - 0.2) / 0.4
            color = (1.0, 0.5 - 0.2*u, 0.5 + 0.3*u, 1.0)
        else:
            # Deep purple/fuchsia
            u = (t - 0.6) / 0.4
            color = (1.0 - 0.7*u, 0.1, 0.8 - 0.4*u, 1.0)
            
        # Opacity envelope
        alpha = 0.85
        if t < 0.05:
            alpha = t / 0.05
        elif t > 0.8:
            alpha = 0.85 * (1.0 - (t - 0.8) / 0.2)
            
        color = (color[0], color[1], color[2], alpha)
        
        for j in range(n_theta):
            angle = (j / n_theta) * math.pi * 2
            
            # Position in vertical X-Z plane
            x_base = r * math.cos(angle)
            z_base = r * math.sin(angle)
            
            # Warp Y to curve around the event horizon (gravitational lensing warp)
            # The back ring curves forward, the front ring curves backward
            dist_to_center = math.sqrt(x_base**2 + z_base**2)
            warp_amount = 0.25 * math.sin(angle)**2 / (dist_to_center + 0.1)
            y = y_offset + (warp_direction * warp_amount)
            
            vertices.append((x_base, y, z_base))
            vertex_colors.append(color)
            
    # Build faces (quads)
    for i in range(n_r - 1):
        for j in range(n_theta):
            next_j = (j + 1) % n_theta
            v0 = i * n_theta + j
            v1 = i * n_theta + next_j
            v2 = (i + 1) * n_theta + next_j
            v3 = (i + 1) * n_theta + j
            faces.append((v0, v1, v2, v3))
            
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    # Create and assign Vertex Color Layer (backward compatible)
    color_layer = None
    if hasattr(mesh, "color_attributes"):
        if not mesh.color_attributes:
            color_layer = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="CORNER")
        else:
            color_layer = mesh.color_attributes[0]
    elif hasattr(mesh, "vertex_colors"):
        if not mesh.vertex_colors:
            color_layer = mesh.vertex_colors.new(name="Color")
        else:
            color_layer = mesh.vertex_colors[0]
            
    if color_layer:
        for poly in mesh.polygons:
            for loop_idx in poly.loop_indices:
                v_idx = mesh.loops[loop_idx].vertex_index
                color_layer.data[loop_idx].color = vertex_colors[v_idx]
                
    # Smooth shading
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth()
    
    # Assign material
    mat = create_glow_material(name + "_Material")
    obj.data.materials.append(mat)
    
    return obj

def animate_lensing_spin(obj, duration_frames=120, spin_direction=-1):
    obj.rotation_mode = 'XYZ'
    
    # Frame 1 keyframe (0 rad around Y axis - screen depth axis for vertical X-Z rings)
    obj.rotation_euler[1] = 0.0
    obj.keyframe_insert(data_path="rotation_euler", index=1, frame=1)
    
    # Frame 121 keyframe (2*pi rad)
    obj.rotation_euler[1] = spin_direction * 2.0 * math.pi
    obj.keyframe_insert(data_path="rotation_euler", index=1, frame=duration_frames + 1)
    
    # Interpolation to linear & loop action cyclic
    if obj.animation_data and obj.animation_data.action:
        action = obj.animation_data.action
        for fcurve in action.fcurves:
            if fcurve.data_path == "rotation_euler" and fcurve.array_index == 1:
                for kp in fcurve.keyframe_points:
                    kp.interpolation = 'LINEAR'
                fcurve.modifiers.new(type='CYCLIC')
                break

if __name__ == "__main__":
    delete_existing_lensing()
    
    # 1. Back lensing ring (deflected background light, larger, bent forward)
    # warp_direction = +1 pushes the sides of the rear ring forward
    ring_back = build_lensing_ring(
        name="LensingRing_Back",
        r_min=0.95,
        r_max=2.0,
        n_r=18,
        n_theta=100,
        y_offset=-0.15,
        warp_direction=1.0
    )
    animate_lensing_spin(ring_back, duration_frames=120, spin_direction=-1) # Spins counter-clockwise
    
    # 2. Front lensing ring (deflected foreground light, smaller, bent backward)
    # warp_direction = -1 pushes the sides of the front ring backward
    ring_front = build_lensing_ring(
        name="LensingRing_Front",
        r_min=0.85,
        r_max=1.45,
        n_r=14,
        n_theta=90,
        y_offset=0.15,
        warp_direction=-1.0
    )
    animate_lensing_spin(ring_front, duration_frames=120, spin_direction=1.0) # Spins clockwise for contrast
    
    print("Étape 3 : Anneaux de lentille gravitationnelle (Back/Front) animés créés avec succès !")
