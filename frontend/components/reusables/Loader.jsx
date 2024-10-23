import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const Loader = ({ text }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={60} color="#FEA13D" />
      <Text className="text-lg text-secondary mt-3">{`Loading${
        text ?? ""
      }...`}</Text>
    </View>
  );
};

export default Loader;
