
// Our camera is available under group 0 (defined by setBindGroup call of render pass), binding 0.
@binding(0) @group(0) var<uniform> tMat: mat4x4<f32>;
// Our texture data is available in shaders in binding 1 and 2 of first bind group:
@group(0) @binding(1) var logoTexture: texture_2d<f32>;
@group(0) @binding(2) var logoSampler: sampler;

struct VertexOut {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>
}

// Here we have used our vertex buffer - locations are the same as `buffers` in render pipeline.
@vertex
fn vs_main(@location(0) position: vec4<f32>, @location(1) uv: vec2<f32>) -> VertexOut {
    var out: VertexOut;

    // Multiply our vertices to change coordinate system to camera coordinates.
    out.position = tMat * position;
    out.uv = uv;

    return out;
}

@fragment
fn fs_main(in: VertexOut) -> @location(0) vec4<f32> {
    return textureSample(logoTexture, logoSampler, in.uv);
}
