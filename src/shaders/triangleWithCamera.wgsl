// Our camera is available under group 0 (defined by setBindGroup call of render pass), binding 0.
@binding(0) @group(0) var<uniform> tMat: mat4x4<f32>;

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>
}

@vertex
fn vs_main(@builtin(vertex_index) index: u32) -> VertexOut {
    var vertices = array<vec2<f32>, 3>(
        vec2( 0.0,  0.5),
        vec2(-0.5, -0.5),
        vec2( 0.5, -0.5)
    );

    var colors = array<vec3<f32>, 3>(
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 1.0)
    );

    var out: VertexOut;

    // Multiply our vertices to change coordinate system to camera coordinates.
    out.position = tMat * vec4(vertices[index], 1.0, 1.0);
    out.color = vec4(colors[index], 1.0);

    return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
    return in.color;
}
