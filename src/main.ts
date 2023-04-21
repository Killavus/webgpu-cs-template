import "./style.css";
import { init } from "./webgpu";

import triangleSolid from "./shaders/triangleSolid.wgsl?raw";
const [device, context] = await init(document.querySelector("#my-canvas")!);

// Create a shader. Shaders are programs which process data sent to the GPU by us.
// There are multiple types of shaders - WebGPU supports three: vertex, fragment, compute.
// Vertex shaders process vertices of our primitives - mostly triangles.
// Fragment shaders process all points that are part of primitives, producing their colors.
// Compute shaders are generic functions you can process using GPU.
const shader = device.createShaderModule({
  code: triangleSolid,
});

// Get the next rendered frame in the canvas as a GPU texture.
// Textures are basically screens that we can use to write to and sample pixels from.
const view = context.getCurrentTexture().createView();

// GPU works in a pipeline which combines fixed functions of GPU (like blend modes, forming primitives etc.)
// with programmable stages - we define them as shaders.
// We need to create such pipeline.
const pipeline = device.createRenderPipeline({
  // Pipeline layout defined how data "looks" and "binds" to shaders.
  // We have no data, so we leave it for now.
  layout: "auto",
  // Define our fragment shader to be used in this pipeline.
  // It's a fs_main function within triangleSolid shader.
  // Targets specify what is the output format for the fragment shader.
  fragment: {
    module: shader,
    entryPoint: "fs_main",
    targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
  },
  // Define our vertex shader to be used in this pipeline.
  // It's a vs_main function within triangleSolid shader.
  vertex: {
    module: shader,
    entryPoint: "vs_main",
  },
  // Primitive settings specify how triangles or other GPU primitives
  // should get formed from our vertex data.
  // We select triangle list, which means that every three vertices will be considered
  // a triangle.
  // We can also set up more advanced stuff like culling (auto-discarding invisible vertices).
  primitive: {
    topology: "triangle-list",
  },
});

// Pipeline is set. Let's ask GPU to write stuff to our canvas!
// First of all, create command encoder. It allows us to create a buffer of commands
// to be submitted to GPU later.
const encoder = device.createCommandEncoder();

// We ask GPU to render by creating a "render pass".
const renderPass = encoder.beginRenderPass({
  // Specify to where we are drawing.
  colorAttachments: [
    {
      // Write to canvas texture.
      view,
      // Clear it up with black pixels first.
      clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
      // On loading the view, clear it using clearValue.
      loadOp: "clear",
      // After executing the render pass, store its results in our texture view.
      storeOp: "store",
    },
  ],
});

// Use our pipeline we've defined before.
renderPass.setPipeline(pipeline);
// Draw 3 vertices, instanced once.
renderPass.draw(3, 1, 0, 0);
// Finish the render pass.
renderPass.end();
// We don't want to send more commands to the GPU.
// We finish encoding commands and submit the work to GPU.
device.queue.submit([encoder.finish()]);

// Congrats on your first triangle!
