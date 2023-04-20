import "./style.css";
import { init } from "./webgpu";

const [device, context] = await init(document.querySelector("#my-canvas")!);
