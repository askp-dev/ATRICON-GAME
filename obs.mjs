import { OBSWebSocket } from "obs-websocket-js";
import process from "process";
import { loadEnvFile } from "node:process";

loadEnvFile();
const obs = new OBSWebSocket();

await obs.connect(
  process.env.OBS_WEBSOCKET_URL,
  process.env.OBS_WEBSOCKET_PASSWORD
);

obs
  .call("SetInputSettings", {
    inputName: "Text (FreeType 2)",
    inputSettings: { text: "Hello,33  OBS!" },
  })
  .then((data) => console.log(data));

console.log("Connected to OBS WebSocket");
