import Config from './config.json';

// eslint-disable-next-line no-useless-concat
const API_URL = (!Config.API_URL.startsWith('$'))? Config.API_URL: "http://localhost:8080"


export const URL = 
    (API_URL.slice(-1) === "/")? API_URL.slice(0, -1): API_URL