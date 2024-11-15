import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";
import { getCurrentUser, signOut } from "../lib/db";
import useNetworkChecker from "../lib/useNetworkChecker";
import useTimestamps from "../lib/useTimestamps";
import useDepartments from "../lib/useDepartments";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  // custom Hooks
  const { networkStatus, handleLogout } = useNetworkChecker(
    setUser,
    setIsLoggedIn
  );
  const { ongoingEvent } = useTimestamps(accessToken, networkStatus);
  const { departments } = useDepartments(accessToken, networkStatus);

  const signalLevel = networkStatus
    ? networkStatus.signal_level
    : null ?? "something";

  const logout = async () => {
    try {
      await signOut();
      handleLogout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    if (signalLevel) {
      if (signalLevel <= -70) {
        // console.log("Signal level is weak:", signalLevel);
        Alert.alert(
          "Warning",
          "Your Wi-Fi signal seems too weak. Please check your connection!"
        );
      }
    } else {
      console.log("Signal level is undefined or null");
      logout();
    }
  }, [networkStatus, signalLevel]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (token) {
          setAccessToken(token);
        } else {
          setAccessToken("");
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
  }, [isLoading, accessToken]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        setIsLoading,
        accessToken,
        networkStatus,
        logout,
        departments,
        ongoingEvent,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
