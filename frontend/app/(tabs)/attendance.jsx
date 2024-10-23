import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";

const attendance = () => {
  const { networkStatus } = useGlobalContext();

  // console.log("networkStatus Attendance", networkStatus);

  // if (!networkStatus) {
  //   return <Text>Loading...</Text>;
  // }

  return (
    <SafeAreaView>
      <View>
        {networkStatus && networkStatus !== null ? (
          <Text>{networkStatus.ssid}</Text>
        ) : (
          <Text>No Wi-Fi connections found.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default attendance;
