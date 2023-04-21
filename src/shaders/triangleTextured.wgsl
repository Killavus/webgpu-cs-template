// Our camera is available under group 0 (defined by setBindGroup call of render pass), binding 0.
@binding(0) @group(0) var<uniform> tMat: mat4x4<f32>;
// Our texture data is available in shaders in binding 1 and 2 of first bind group:
@group(0) @binding(1) var logoTexture: texture_2d<f32>;
@group(0) @binding(2) var logoSampler: sampler;

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>
}

@vertex
fn vs_main(@builtin(vertex_index) index: u32) -> VertexOut {
    var vertices = array<vec2<f32>, 3>(
        vec2( 0.0,  0.5),
        vec2(-0.5, -0.5),
        vec2( 0.5, -0.5)
    );

    // Textures are sampled in UV coordinate system.
    // UV is (0, 0) top left, (1, 1) bottom right.
    var uv = array<vec2<f32>, 3>(
        vec2(0.5, 0.2),
        vec2(0.0, 0.7),
        vec2(1.0, 0.7)
    );

    var out: VertexOut;

    // Multiply our vertices to change coordinate system to camera coordinates.
    out.position = tMat * vec4(vertices[index], 1.0, 1.0);
    out.uv = uv[index];

    return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
    return textureSample(logoTexture, logoSampler, in.uv);
}
