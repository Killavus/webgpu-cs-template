# WebGPU - What is it?

WebGPU is a new standard for interacting with GPU made by Mozilla, Apple & Google.
It's a [W3C Standard](https://www.w3.org/TR/webgpu/), together with the new shading language, [WGSL](https://www.w3.org/TR/WGSL/).

It moves 3D graphic APIs from quite outdated [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) to modern world.

# Why not WebGL?

WebGL is based on OpenGL, thus it works as a big, global state machine. It tries to hide inherent asynchrony of GPUs nowadays and have no support for general compute on GPU.

WebGPU is more akin to Vulkan / Metal / DirectX 12 family of APIs - a modern approach which better models how GPU works under the hood. It reduces complexity of GPU drivers while allowing you to have more fine-grained control over your computation.

WebGPU uses the queue model to allow for multi-threaded operation, which is very hard with OpenGL-based solutions. On web it's available in Web Workers, allowing for parallel execution.

# Why should I care?

- Together with WebAssembly, WebGPU is a great foundation to port games without big performance hit on the browser.
- It creates a great abstraction layer over existing graphic APIs, making cross-platform easier. In fact, WebGPU can be used in native code as well. So instead of writing multiple DirectX / Metal / Vulkan APIs, you can just use WebGPU for simpler cases.
- You can create video processing and image processing pipelines utilizing GPU, allowing for the whole class of applications to exist in the browser, like video editing software.
- It's fun :).

# Goal:

The goal today is to get used to WebGPU model of operation - create a render pipeline, shove some data to GPU, use shaders to color your pixels and display them on the screen.

You'll get an understanding of most basic building blocks of GPU programming, based on WebGPU, but applicable in every other graphic API.

The end result will be a rotating, textured cube displayed in your canvas.

See `intro` branch for your first triangle, and `passing-data` branch will give you all knowledge required to pass arbitrary data to your GPU.

The starting point for this exercise is in `start-cube` branch.
