import bpy

def setup_scene():
    # Clear all existing objects to start fresh
    if bpy.ops.object.select_all:
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete(use_global=False)

def create_singularity_material():
    mat_name = "BlackHole_Singularity"
    
    # Reuse if exists, otherwise create
    if mat_name in bpy.data.materials:
        mat = bpy.data.materials[mat_name]
    else:
        mat = bpy.data.materials.new(name=mat_name)
        
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    
    # Create BSDF node
    bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
    bsdf.location = (0, 0)
    
    # Set to absolute black (absorbing all light)
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

def build_singularity(radius=0.8):
    # Add UV sphere for event horizon
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
    
    # Assign singularity material
    mat = create_singularity_material()
    obj.data.materials.append(mat)
    
    print("Étape 1 : Singularité (Event Horizon) créée avec succès !")

if __name__ == "__main__":
    setup_scene()
    build_singularity(radius=0.8)
