import Config from "./config.json";

// eslint-disable-next-line no-useless-concat
const RFR_API_URL = !Config.RFR_API_URL.startsWith("$")
  ? Config.RFR_API_URL
  : ( process.env.REACT_APP_RFR_API_URL ?? "http://localhost:8080");

export const URL =
  RFR_API_URL.slice(-1) === "/" ? RFR_API_URL.slice(0, -1) : RFR_API_URL;

  console.log(`Got ${Config.RFR_API_URL} in config.json and converted it to ${URL}`);