import { toolbox_default } from "./default.js";
import { category_gpio } from "./gpio.js";
import { category_sensor } from "./sensor.js";
import { category_multimedia } from "./multimedia.js";
import { category_network } from "./network.js";
import { category_special } from "./special.js";

var toolbox = {
  kind: "categoryToolbox",
};

toolbox.contents = toolbox_default.concat(
  category_gpio,
  category_sensor,
  category_multimedia,
  category_network,
  category_special
);

export { toolbox };
