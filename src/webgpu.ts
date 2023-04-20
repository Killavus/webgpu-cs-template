export const init = async (
  canvas: HTMLCanvasElement
): Promise<[GPUDevice, GPUCanvasContext]> => {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("Failed to init adapter.");
  }

  const device = await adapter?.requestDevice();

  const context = canvas.getContext("webgpu");
  if (!context) {
    throw new Error("Failed to initialize Canvas WebGPU context.");
  }

  const pixelFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: pixelFormat,
    alphaMode: "premultiplied",
  });

  return [device, context];
};
