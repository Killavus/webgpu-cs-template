import "./style.css";
import { init } from "./webgpu";
import { mat4, vec3 } from "gl-matrix";
import callstackLogo from "./assets/callstack.png";

import triangleTextured from "./shaders/triangleTextured.wgsl?raw";
const [device, context] = await init(document.querySelector("#my-canvas")!);

// GPU would be useless if we'd not be able to pass arbitrary data to our GPU to work on.
// There are two (three, but one is not supported) ways to pass data:
// * Textures - which are images which can be used to sample from them or write to them.
// * Buffers - which can be used to pass an arbitrary data. In compute stage you can also write
//   to them.

// Let's introduce camera to our triangle. You'll use a buffer type which is called an "uniform"
// buffer.
const canvas: HTMLCanvasElement = document.querySelector("#my-canvas")!;
const aspectRatio = canvas.width / canvas.height;

const shader = device.createShaderModule({ code: triangleTextured });

const pipeline = device.createRenderPipeline({
  layout: "auto",
  fragment: {
    module: shader,
    entryPoint: "fs_main",
    targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
  },
  vertex: {
    module: shader,
    entryPoint: "vs_main",
  },
  primitive: {
    topology: "triangle-list",
  },
});

const projectionMat = mat4.create();
// This creates a perspective projection (so stuff farther away is smaller).
// See: https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/building-basic-perspective-projection-matrix.html
// for details.
mat4.perspective(projectionMat, (2 * Math.PI) / 5, aspectRatio, 1.0, 100.0);

function transformationMatrix(t: number): Float32Array {
  const viewMat = mat4.create();
  // Move model coordinates (x, y, 1.0) farther from the camera.
  mat4.translate(viewMat, viewMat, vec3.fromValues(0, 0, -4));

  // Rotate every frame around the Z axis, so x & y will change and z will remain unchanged.
  mat4.rotateZ(viewMat, viewMat, t);

  const cameraMat = mat4.create();
  mat4.multiply(cameraMat, projectionMat, viewMat);
  return cameraMat as Float32Array;
}

const cameraUniformBuffer = device.createBuffer({
  // 4 * 16 = 4 * 4 = 16 and float is 4 bytes each.
  size: 4 * 16,
  // We want to copy to this buffer from our CPU,
  // and it'll be used as uniform buffer in the pipeline.
  usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
});

// Let's create a texture to sample points from:
let logoTexture: GPUTexture;
{
  // Create in-memory image, decode it to image bitmap and copy to GPU.
  const img = document.createElement("img");
  img.src = new URL(callstackLogo, import.meta.url).toString();
  await img.decode();
  const imageBitmap = await createImageBitmap(img);

  logoTexture = device.createTexture({
    size: [imageBitmap.width, imageBitmap.height, 1],
    format: "rgba8unorm",
    usage:
      // We want to bind this texture in our shader.
      GPUTextureUsage.TEXTURE_BINDING |
      // We want to copy from it.
      GPUTextureUsage.COPY_DST |
      // I don't know why we need it - it's used when it's an output texture.
      // It is not :).
      GPUTextureUsage.RENDER_ATTACHMENT,
  });
  device.queue.copyExternalImageToTexture(
    { source: imageBitmap },
    { texture: logoTexture },
    [imageBitmap.width, imageBitmap.height]
  );
}

// Sampler is a way of taking color from textures. It defines how we "sample" texture.
// magFilter and minFilter are strategies used when texture size is not aligned with
// our viewport size - it defines how color should be sampled from multiple pixels of
// textures.
const textureSampler = device.createSampler({
  magFilter: "linear",
  minFilter: "linear",
});

// In order to define how we pass data to shaders, we use bind groups.
// Bind groups define how data is lay out and how to access it
// from perspective of shader.
const bindGroup = device.createBindGroup({
  // It follows the layout of the first group inside our pipeline.
  // You can have multiple groups with predefined layouts
  // and switch bind groups every render pass.
  layout: pipeline.getBindGroupLayout(0),
  // Camera matrix uniform will occupy slot (binding 0) of this bind group.
  entries: [
    { binding: 0, resource: { buffer: cameraUniformBuffer } },
    // NEW: Pass our sampler & texture to bind group.
    { binding: 1, resource: logoTexture.createView() },
    { binding: 2, resource: textureSampler },
  ],
});

const renderFrame = () => {
  const view = context.getCurrentTexture().createView();
  const encoder = device.createCommandEncoder();
  // Get our transformation matrix.
  const tMat = transformationMatrix(Date.now() / 1000.0);

  // Move our buffer data to GPU.
  device.queue.writeBuffer(
    cameraUniformBuffer,
    0,
    tMat.buffer,
    tMat.byteOffset,
    tMat.byteLength
  );

  const renderPass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view,
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  renderPass.setPipeline(pipeline);
  // We need to set bind group we've created to use in shaders.
  renderPass.setBindGroup(0, bindGroup);
  renderPass.draw(3, 1, 0, 0);
  renderPass.end();
  device.queue.submit([encoder.finish()]);
  requestAnimationFrame(renderFrame);
};

requestAnimationFrame(renderFrame);
