import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../lib/db";
import useNetworkChecker from "../lib/useNetworkChecker";
import { router } from "expo-router";
import { Alert } from "react-native";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  const { networkStatus } = useNetworkChecker();

  const logout = async () => {
    // setIsLoggedIn(false);
    router.replace("/login");
  };

  useEffect(() => {
    if (networkStatus === null) {
      logout();
    } else {
      if (networkStatus.signal_level <= -70) {
        Alert.alert(
          "Warning",
          "Your Wi-Fi signal seems too weak. Please check your connection!"
        );
      }
    }
  }, [networkStatus]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setAccessToken(token);
        }
      } catch (error) {
        console.log("Error getting token:", error.message);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken) {
        try {
          const res = await getCurrentUser(accessToken);
          if (res) {
            setIsLoggedIn(true);
            setUser(res.data);
          } else {
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.log("Error fetching user:", error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
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
        networkStatus,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
