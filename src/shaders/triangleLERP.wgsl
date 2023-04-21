// Return two values to fragment shader from vertex shader now.
// We'll use color of vertices to show how linear interpolation works.
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

    // Every vertex will have a color now.
    // We'll use it to sample color for every pixel of this triangle.
    var colors = array<vec3<f32>, 3>(
        vec3(1.0, 0.0, 0.0),
        vec3(0.0, 1.0, 0.0),
        vec3(0.0, 0.0, 1.0)
    );

    var out: VertexOut;

    out.position = vec4(vertices[index], 0.0, 1.0);
    out.color = vec4(colors[index], 1.0);

    return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
    // Color for every fragment (pixel) will be a linear interpolation between
    // every vertex of this triangle, creating a rainbow.
    return in.color;
}
