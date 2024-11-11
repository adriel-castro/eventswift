import { Alert } from "react-native";
import { useState, useEffect } from "react";
import { connectionStatus, signOut } from "./db";
import { router } from "expo-router";

const useNetworkChecker = (setUser, setIsLoggedIn) => {
  const [networkStatus, setNetworkStatus] = useState(null);
  const [isNetworkLoading, setIsNetworkLoading] = useState(false);
  let intervalId;

  useEffect(() => {
    const wifiConnection = async () => {
      setIsNetworkLoading(true);
      try {
        const wifi = await connectionStatus();
        // console.log("wifi", wifi.data);

        if (wifi && wifi.data) {
          setNetworkStatus(wifi.data);
        } else {
          setNetworkStatus(null);
          Alert.alert("Warning", "No Wi-Fi data received.");
        }
      } catch (error) {
        Alert.alert("Error1", error.message);
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        handleLogout();
      } finally {
        setIsNetworkLoading(false);
      }
    };

    // Initial check
    wifiConnection();

    intervalId = setInterval(() => {
      wifiConnection();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    clearInterval(intervalId);
    // signOut();
    router.replace("/login");
  };

  return { isNetworkLoading, networkStatus, handleLogout };
};

export default useNetworkChecker;
