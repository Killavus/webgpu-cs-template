import "./style.css";
import { init } from "./webgpu";
import { mat4, vec3 } from "gl-matrix";
import callstackLogo from "./assets/callstack.png";

import triangleTexturedVertexBuffer from "./shaders/triangleTexturedVertexBuffer.wgsl?raw";
const [device, context] = await init(document.querySelector("#my-canvas")!);

const canvas: HTMLCanvasElement = document.querySelector("#my-canvas")!;
const aspectRatio = canvas.width / canvas.height;

// Now draw the rest of the motherf****ing owl.
// Our goal is to create a textured, rotating cube.
// You can use:
// https://webgpu.github.io/webgpu-samples/samples/texturedCube
// https://webgpu.github.io/webgpu-samples/samples/rotatingCube
// for reference.

// There are coordinates of a cube you can shove into vertex buffer.
// You may want to update it with uv coordinates if you want your cube textured.

// If you managed to do it, there can be further challenges:
// 1. How to render multiple cubes? Learn about indexing.
// 2. How to optimize to not render unnecessary vertices?
//    See cull configuration in WebGPU samples, learn about triangle winding and triangle faces.
// 3. Draw a circle in a fragment shader.
//    Use a simple quad (two triangles taking the whole screen) as your canvas.
//    Learn about `step` and `smoothStep` built-in functions in WGSL.
// 4. Implement Phong lighting model and illuminate your cube.
//    See https://learnopengl.com/Lighting/Basic-Lighting and translate it to WebGPU.
// Have fun! :)

// prettier-ignore
export const cubeVertexArray = new Float32Array([
  1, -1, 1, 1,
  -1, -1, 1, 1,
  -1, -1, -1, 1,
  1, -1, -1, 1,
  1, -1, 1, 1,
  -1, -1, -1, 1,

  1, 1, 1, 1,
  1, -1, 1, 1,
  1, -1, -1, 1,
  1, 1, -1, 1,
  1, 1, 1, 1,
  1, -1, -1, 1,

  -1, 1, 1, 1,
  1, 1, 1, 1,
  1, 1, -1, 1,
  -1, 1, -1, 1,
  -1, 1, 1, 1,
  1, 1, -1, 1,

  -1, -1, 1, 1,
  -1, 1, 1, 1,
  -1, 1, -1, 1,
  -1, -1, -1, 1,
  -1, -1, 1, 1,
  -1, 1, -1, 1,

  1, 1, 1, 1,
  -1, 1, 1, 1,
  -1, -1, 1, 1,
  -1, -1, 1, 1,
  1, -1, 1, 1,
  1, 1, 1, 1,

  1, -1, -1, 1,
  -1, -1, -1, 1,
  -1, 1, -1, 1,
  1, 1, -1, 1,
  1, -1, -1, 1,
  -1, 1, -1, 1,
]);
