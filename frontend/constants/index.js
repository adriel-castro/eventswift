import Constants from "expo-constants";
import icons from "./icons";
import images from "./images";

// const baseURL = process.env.EXPO_PUBLIC_NODE_URL;
const baseURL = Constants.expoConfig.extra.NODE_API;
console.log(baseURL)

export { baseURL, icons, images };
