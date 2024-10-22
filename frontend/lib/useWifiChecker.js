import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Network from "expo-network";
import { signOut } from "./db";
import { router } from "expo-router";

const useWifiChecker = () => {
  const [connectedSSID, setConnectedSSID] = useState(null);
  const [alertShown, setAlertShown] = useState(false); // Track if alert has been shown

  const univIpAddress = process.env.EXPO_PUBLIC_WIFI_IP;

  const logout = async () => {
    await signOut();
    router.replace("/login");
  };

  useEffect(() => {
    const checkWifiConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        const currentIPAddress = await Network.getIpAddressAsync();

        if (
          networkState.isConnected &&
          networkState.type === Network.NetworkStateType.WIFI
        ) {
          if (currentIPAddress !== univIpAddress && !alertShown) {
            Alert.alert(
              "Wi-Fi Connection",
              "You are connected to a different Wi-Fi. Please connect to the University Wi-Fi."
            );
            setAlertShown(true); // Mark the alert as shown
            logout();
          }
        } else if (!alertShown) {
          Alert.alert(
            "Wi-Fi Connection",
            "Please connect to the University Wi-Fi."
          );
          setAlertShown(true); // Mark the alert as shown
          logout();
        }

        setConnectedSSID(currentIPAddress);
      } catch (error) {
        console.error(error);
        if (!alertShown) {
          Alert.alert(
            "Error",
            "An error occurred while checking Wi-Fi connection."
          );
          setAlertShown(true); // Mark the alert as shown
          logout();
        }
        setConnectedSSID(null);
      }
    };

    const intervalId = setInterval(checkWifiConnection, 5000); // Check every 30 seconds

    return () => clearInterval(intervalId); // Cleanup
  }, [alertShown]);

  return { connectedSSID };
};

export default useWifiChecker;
