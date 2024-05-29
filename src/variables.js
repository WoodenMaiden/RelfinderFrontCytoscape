export const URL =
  process.env.NODE_ENV === "development" && process.env.REACT_APP_RFR_API_URL
    ? process.env.REACT_APP_RFR_API_URL
    : "/api";
