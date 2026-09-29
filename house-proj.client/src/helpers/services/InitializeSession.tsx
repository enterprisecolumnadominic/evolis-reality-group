import ApiService from "./ApiService";

export const initializeSession = async () => {
  try {
    // This hits your https://localhost:7259/api/Session/init
    const response = await ApiService.get("/Session/init"); //json config
    console.log("Session Handshake Successful", response.data);
    return true;
  } catch (error) {
    console.error("Session Handshake Failed", error);
    return false;
  }
};
