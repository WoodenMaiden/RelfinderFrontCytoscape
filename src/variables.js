const API_URL = null ?? "http://localhost:8080"


export const URL = 
    (API_URL.slice(-1) === "/")? API_URL.slice(0, -1): API_URL