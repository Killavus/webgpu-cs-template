import "./style.css";
import { init } from "./webgpu";
import { mat4, vec3 } from "gl-matrix";

import triangleWithCamera from "./shaders/triangleWithCamera.wgsl?raw";
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

const shader = device.createShaderModule({ code: triangleWithCamera });

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

function transformationMatrix(): Float32Array {
  const viewMat = mat4.create();
  // Move model coordinates (x, y, 1.0) farther from the camera.
  mat4.translate(viewMat, viewMat, vec3.fromValues(0, 0, -4));

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

// In order to define how we pass data to shaders, we use bind groups.
// Bind groups define how data is lay out and how to access it
// from perspective of shader.
const bindGroup = device.createBindGroup({
  // It follows the layout of the first group inside our pipeline.
  // You can have multiple groups with predefined layouts
  // and switch bind groups every render pass.
  layout: pipeline.getBindGroupLayout(0),
  // Camera matrix uniform will occupy slot (binding 0) of this bind group.
  entries: [{ binding: 0, resource: { buffer: cameraUniformBuffer } }],
});

const renderFrame = () => {
  const view = context.getCurrentTexture().createView();
  const encoder = device.createCommandEncoder();
  // Get our transformation matrix.
  const tMat = transformationMatrix();

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
