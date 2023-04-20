import "./style.css";
const canvas: HTMLCanvasElement = document.querySelector("#my-canvas")!;

// Create an adapter. Adapter is an identifier for WebGPU implementation.
// One adapter represents one device and set of features supported by it.
// You can also request for high performance / low power device through options.
// It is only a suggestion to the browser though - nothing is guaranteed.
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error("Failed to init adapter.");
}

// Request a device from adapter.
// You can pass required features of the device - it'll fail if device is not supporting them.
// You can inspect which feature device supports by calling `getAdapterInfo` on your
// adapter instance.
const device = await adapter?.requestDevice();

// You have your device instance ready. Now we need a surface to paint on.
// This will be our canvas!

// This returns an object with all required methods to paint on canvas using WebGPU.
const context = canvas.getContext("webgpu");
if (!context) {
  throw new Error("Failed to initialize Canvas WebGPU context.");
}

// Get the best possible format of storing color pixels for our GPU and browser.
const pixelFormat = navigator.gpu.getPreferredCanvasFormat();

// Now our canvas is configured to use WebGPU device we've requested.
// alphaMode: "premultiplied" is how we handle transparency when we are using
// canvas context as a texture to read from.
context.configure({
  device,
  format: pixelFormat,
  alphaMode: "premultiplied",
});
