const toreplace_API_URL = null ?? "http://localhost:8080"


export const URL = 
    (toreplace_API_URL.slice(-1) === "/")? process.env.REACT_APP_API_URL.slice(0, -1): toreplace_API_URL