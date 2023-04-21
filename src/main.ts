import "./style.css";
import { init } from "./webgpu";

import triangleLERP from "./shaders/triangleLERP.wgsl?raw";
const [device, context] = await init(document.querySelector("#my-canvas")!);

const shader = device.createShaderModule({
  code: triangleLERP,
});

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

const renderFrame = () => {
  const view = context.getCurrentTexture().createView();
  const encoder = device.createCommandEncoder();
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
  renderPass.draw(3, 1, 0, 0);
  renderPass.end();
  device.queue.submit([encoder.finish()]);
  requestAnimationFrame(renderFrame);
};

requestAnimationFrame(renderFrame);
