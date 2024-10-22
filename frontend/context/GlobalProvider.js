import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser, signOut } from "../lib/db";
// import useWifiChecker from "../lib/useWifiChecker";
// import { router } from "expo-router";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token !== null) {
          setAccessToken(token);
        }
      } catch (error) {
        console.log("error getting token", error.message);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (accessToken !== null && accessToken !== "") {
      getCurrentUser(accessToken)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setUser(res.data);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [accessToken]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        accessToken,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
