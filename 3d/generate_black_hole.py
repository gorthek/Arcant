import bpy
import math
import random

def setup_scene():
    # Clear existing objects in default scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def create_singularity_material():
    mat_name = "BlackHole_Singularity"
    mat = bpy.data.materials.new(name=mat_name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    # Create BSDF node
    bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
    bsdf.location = (0, 0)
    # Set to pure black and rough
    bsdf.inputs['Base Color'].default_value = (0, 0, 0, 1)
    bsdf.inputs['Roughness'].default_value = 1.0
    if 'Specular' in bsdf.inputs:
        bsdf.inputs['Specular'].default_value = 0.0
    if 'Specular IOR Level' in bsdf.inputs: # Blender 4.0+
        bsdf.inputs['Specular IOR Level'].default_value = 0.0
        
    # Output node
    output = nodes.new(type="ShaderNodeOutputMaterial")
    output.location = (300, 0)
    mat.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    return mat

def create_glow_material(name, emission_strength=2.5):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    # Principled BSDF
    bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
    bsdf.location = (0, 0)
    bsdf.inputs['Roughness'].default_value = 0.2
    
    # Attribute Node to read vertex colors (RGBA)
    attr = nodes.new(type="ShaderNodeAttribute")
    attr.attribute_name = "Color"
    attr.location = (-300, 0)
    
    # Output node
    output = nodes.new(type="ShaderNodeOutputMaterial")
    output.location = (300, 0)
    
    # Connect color to base color
    links.new(attr.outputs['Color'], bsdf.inputs['Base Color'])
    
    # Connect color to emission and set emission strength
    if 'Emission Color' in bsdf.inputs:  # Blender 4.0+
        links.new(attr.outputs['Color'], bsdf.inputs['Emission Color'])
        bsdf.inputs['Emission Strength'].default_value = emission_strength
    elif 'Emission' in bsdf.inputs:      # Blender 3.x
        links.new(attr.outputs['Color'], bsdf.inputs['Emission'])
        bsdf.inputs['Emission Strength'].default_value = emission_strength
        
    # Connect alpha channel for transparency
    links.new(attr.outputs['Alpha'], bsdf.inputs['Alpha'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
    
    # Enable viewport transparency
    mat.blend_method = 'BLEND'
    mat.shadow_method = 'NONE'
    
    return mat

def build_singularity(radius=0.8):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=64, 
        ring_count=64, 
        radius=radius, 
        location=(0, 0, 0)
    )
    obj = bpy.context.active_object
    obj.name = "Singularity"
    
    # Apply smooth shading
    bpy.ops.object.shade_smooth()
    
    # Add material
    mat = create_singularity_material()
    obj.data.materials.append(mat)
    return obj

def build_disk_mesh(name, r_min, r_max, n_r, n_theta, is_vertical=False, z_offset=0.0):
    # Create mesh and object
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
            
            # If horizontal, we add a spiral twist
            if not is_vertical:
                twist_factor = 2.8
                theta_twist = angle + (t * twist_factor)
                
                # Height perturbation for wavy accretion disk
                wavy_height = math.sin(angle * 3.0 - t * 4.0) * 0.04 * (1.0 - t)
                
                x = r * math.cos(theta_twist)
                y = r * math.sin(theta_twist)
                z = wavy_height
            else:
                # Vertical ring in X-Z plane, slightly offset in Y
                x = r * math.cos(angle)
                y = z_offset
                z = r * math.sin(angle)
                
            vertices.append((x, y, z))
            vertex_colors.append(color)
            
    # Build faces (quads)
    for i in range(n_r - 1):
        for j in range(n_theta):
            next_j = (j + 1) % n_theta
            # Corner indices
            v0 = i * n_theta + j
            v1 = i * n_theta + next_j
            v2 = (i + 1) * n_theta + next_j
            v3 = (i + 1) * n_theta + j
            faces.append((v0, v1, v2, v3))
            
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    
    # Create and assign Vertex Color Layer
    if not mesh.color_attributes:
        color_layer = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="CORNER")
    else:
        color_layer = mesh.color_attributes[0]
        
    # Write colors to corners
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            v_idx = mesh.loops[loop_idx].vertex_index
            color_layer.data[loop_idx].color = vertex_colors[v_idx]
            
    # Apply smooth shading
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth()
    
    # Assign Glow material
    mat = create_glow_material(name + "_Material")
    obj.data.materials.append(mat)
    
    return obj

def animate_rotation(obj, duration_frames=120):
    obj.rotation_mode = 'XYZ'
    
    # Frame 1 keyframe (0 rad)
    obj.rotation_euler[2] = 0.0
    obj.keyframe_insert(data_path="rotation_euler", index=2, frame=1)
    
    # Frame 121 keyframe (2*pi rad to make it seamlessly loop at 120)
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
                
                # Add cyclic generator modifier to loop forever
                mod = fcurve.modifiers.new(type='CYCLIC')
                break

def main():
    setup_scene()
    
    # 1. Singularity
    print("Generating Singularity (Event Horizon)...")
    build_singularity(radius=0.8)
    
    # 2. Flat Accretion Disk
    print("Generating Flat Accretion Disk...")
    disk_flat = build_disk_mesh(
        name="AccretionDisk_Flat", 
        r_min=1.15, 
        r_max=4.2, 
        n_r=45, 
        n_theta=120, 
        is_vertical=False
    )
    
    # Animate accretion disk rotation
    animate_rotation(disk_flat, duration_frames=120)
    
    # 3. Lensing Ring - Rear (arch above & below background)
    print("Generating Lensing Ring - Back...")
    build_disk_mesh(
        name="LensingRing_Back", 
        r_min=0.9, 
        r_max=1.8, 
        n_r=15, 
        n_theta=90, 
        is_vertical=True, 
        z_offset=-0.12
    )

    # 4. Lensing Ring - Front (smaller deflection ring wrapping foreground)
    print("Generating Lensing Ring - Front...")
    build_disk_mesh(
        name="LensingRing_Front", 
        r_min=0.85, 
        r_max=1.35, 
        n_r=12, 
        n_theta=80, 
        is_vertical=True, 
        z_offset=0.12
    )

    print("\nTrou noir 3D genere avec succes !")
    print("Conseil pour l'exportation :")
    print("1. Selectionnez tous les objets (A)")
    print("2. Allez dans File -> Export -> glTF 2.0 (.glb/.gltf)")
    print("3. Cochez 'Selected Objects' sous 'Include'")
    print("4. Sous 'Animation', cochez 'Animation' pour inclure la rotation du disque.")
    print("5. Nommez le fichier 'black_hole.glb' et placez-le dans 'apps/web/public/models/'.")

if __name__ == "__main__":
    main()
