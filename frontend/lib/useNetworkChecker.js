import { Alert } from "react-native";
import { useState, useEffect } from "react";
import { connectionStatus, signOut } from "./db";
import { router } from "expo-router";

const useNetworkChecker = () => {
  const [networkStatus, setNetworkStatus] = useState(null); // Change to null to handle undefined
  const [isNetworkLoading, setIsNetworkLoading] = useState(false);

  useEffect(() => {
    const wifiConnection = async () => {
      setIsNetworkLoading(true);
      try {
        const wifi = await connectionStatus();
        // console.log("wifi", wifi.data);

        if (wifi && wifi.data) {
          setNetworkStatus(wifi.data);
        } else {
          setNetworkStatus(null); // If no wifi data, set null
        }
      } catch (error) {
        Alert.alert("Error", error.message);
        router.replace("/login");
      } finally {
        setIsNetworkLoading(false);
      }
    };

    wifiConnection();
  }, []);

  return { isNetworkLoading, networkStatus };
};

export default useNetworkChecker;
