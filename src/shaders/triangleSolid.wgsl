@vertex
fn vs_main(@builtin(vertex_index) index: u32) -> @builtin(position) vec4<f32> {
    // Vertices live in a NDC - Normalized Device Coordinate System.
    // It is [-1, 1] for X and Y axes and [0, 1] for Z axis.
    // [-1, -1] is bottom-left, [ 1, -1 ] is bottom right,
    // [-1, 1] is top left, [1, 1] is top right.

    // These are 3 vertices of our triangle.
    var vertices = array<vec2<f32>, 3>(
        vec2( 0.0,  0.5),
        vec2(-0.5, -0.5),
        vec2( 0.5, -0.5)
    );

    // Fourth dimension is "w" - scaling factor. Mostly set to 1,
    // makes some linear algebra easier when you have it.
    return vec4(vertices[index], 0.0, 1.0);
}

@fragment
fn fs_main() -> @location(0) vec4<f32> {
    // Just paint it all red.
    return vec4(1.0, 0.0, 0.0, 1.0);
}
