import bpy
import math

def delete_existing_disk():
    # If the AccretionDisk already exists, delete it so we can rerun cleanly
    name = "AccretionDisk_Flat"
    if name in bpy.data.objects:
        obj = bpy.data.objects[name]
        bpy.data.objects.remove(obj, do_unlink=True)
    # Also clear unused meshes
    for mesh in bpy.data.meshes:
        if mesh.name.startswith("AccretionDisk_Flat_Mesh"):
            bpy.data.meshes.remove(mesh)

def create_glow_material(name, emission_strength=3.5):
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

def build_accretion_disk(r_min=1.15, r_max=4.5, n_r=60, n_theta=180):
    name = "AccretionDisk_Flat"
    mesh = bpy.data.meshes.new(name=name + "_Mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    
    vertices = []
    faces = []
    vertex_colors = []
    
    for i in range(n_r):
        t = i / (n_r - 1) if n_r > 1 else 0
        r = r_min + t * (r_max - r_min)
        
        # Calculate color gradient based on radius
        # Warm core (white/yellow) -> Hot disc (orange) -> Cooler edge (fuchsia/indigo)
        if t < 0.15:
            # White to Yellow-Orange
            u = t / 0.15
            color = (1.0, 0.95 - 0.2*u, 0.7 - 0.5*u, 1.0) # RGBA
        elif t < 0.6:
            # Orange to Magenta
            u = (t - 0.15) / 0.45
            color = (1.0, 0.75 - 0.75*u, 0.2 + 0.6*u, 1.0)
        else:
            # Magenta to Dark Purple/Indigo (and fade out)
            u = (t - 0.6) / 0.4
            color = (1.0 - 0.8*u, 0.0, 0.8 - 0.5*u, 1.0)
            
        # Set alpha/opacity envelope
        # Sharp fade-in at inner boundary, smooth fade-out at outer boundary
        alpha = 1.0
        if t < 0.05:
            alpha = t / 0.05
        elif t > 0.75:
            alpha = 1.0 - (t - 0.75) / 0.25
        
        # Override alpha in RGBA
        color = (color[0], color[1], color[2], alpha)
        
        for j in range(n_theta):
            angle = (j / n_theta) * math.pi * 2
            
            # Add spiral twist
            twist_factor = 3.2
            theta_twist = angle + (t * twist_factor)
            
            # Fluid distortion: overlapping ripple waves to simulate swirling gas
            wavy_height = (
                math.sin(angle * 4.0 - t * 6.0) * 0.04 * (1.0 - t) +
                math.cos(angle * 8.0 - t * 12.0) * 0.015 * (1.0 - t)
            )
            
            x = r * math.cos(theta_twist)
            y = r * math.sin(theta_twist)
            z = wavy_height
            
            vertices.append((x, y, z))
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
    
    # Create and assign Vertex Color Layer with backward compatibility
    color_layer = None
    if hasattr(mesh, "color_attributes"):
        # Blender 3.2+ API
        if not mesh.color_attributes:
            color_layer = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="CORNER")
        else:
            color_layer = mesh.color_attributes[0]
    elif hasattr(mesh, "vertex_colors"):
        # Blender 2.8x - 3.1 legacy API
        if not mesh.vertex_colors:
            color_layer = mesh.vertex_colors.new(name="Color")
        else:
            color_layer = mesh.vertex_colors[0]
            
    # Write colors to corners if the layer was successfully created
    if color_layer:
        for poly in mesh.polygons:
            for loop_idx in poly.loop_indices:
                v_idx = mesh.loops[loop_idx].vertex_index
                color_layer.data[loop_idx].color = vertex_colors[v_idx]
            
    # Apply smooth shading
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth()
    
    # Assign material
    mat = create_glow_material(name + "_Material")
    obj.data.materials.append(mat)
    
    return obj

def animate_rotation(obj, duration_frames=120):
    obj.rotation_mode = 'XYZ'
    
    # Frame 1 keyframe (0 rad)
    obj.rotation_euler[2] = 0.0
    obj.keyframe_insert(data_path="rotation_euler", index=2, frame=1)
    
    # Frame 121 keyframe (2*pi rad)
    obj.rotation_euler[2] = 2.0 * math.pi
    obj.keyframe_insert(data_path="rotation_euler", index=2, frame=duration_frames + 1)
    
    # Make keyframe extrapolation linear & cyclic
    if obj.animation_data and obj.animation_data.action:
        action = obj.animation_data.action
        for fcurve in action.fcurves:
            if fcurve.data_path == "rotation_euler" and fcurve.array_index == 2:
                # Set interpolation to linear
                for kp in fcurve.keyframe_points:
                    kp.interpolation = 'LINEAR'
                
                # Loop action cyclic
                fcurve.modifiers.new(type='CYCLIC')
                break

if __name__ == "__main__":
    delete_existing_disk()
    disk = build_accretion_disk()
    animate_rotation(disk, duration_frames=120)
    print("Étape 2 : Disque d'accrétion fluide animé créé avec succès !")
