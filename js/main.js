import { bindBrief } from "./form.js";
import { render } from "./render.js";
import { bindSim } from "./simulate.js";

bindBrief(render);
bindSim();
render();
