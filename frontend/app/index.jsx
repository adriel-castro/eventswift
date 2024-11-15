import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "../context/GlobalProvider";
import { images } from "../constants";

const App = () => {
  const { isLoading, isLoggedIn, networkStatus } = useGlobalContext();

  if (!isLoading && isLoggedIn && networkStatus !== null)
    return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full min-h-[85vh] justify-center items-center px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[250px] h-[250px]"
          />
          <CustomButton
            title="Login Eventswift"
            handlePress={() => router.push("/login")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
