import { Alert, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";

import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { eventCheckIn } from "../../lib/db";
import Loader from "../../components/reusables/Loader";

const JoinEvent = () => {
  // const [facing, setFacing] = useState("back");
  const facing = "back";
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, setOngoingEvent } = useGlobalContext();

  // Camera permissions are still loading.
  if (!permission) {
    return <View />;
  }

  // Camera permissions are not granted yet.
  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-10">
          We need your permission to show the camera
        </Text>
        <CustomButton
          title="Grant Permission"
          handlePress={requestPermission}
          containerStyles="mx-5"
        />
      </View>
    );
  }

  // const toggleCameraFacing = () => {
  //   setFacing((current) => (current === "back" ? "front" : "back"));
  // };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("error settingItem to localStorage", error.message);
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    const eventData = typeof data === "string" ? JSON.parse(data) : data;
    const eventId = eventData._id;
    setScanned(true);
    setIsLoading(true);
    try {
      const checkIn = await eventCheckIn(eventId, accessToken);
      // console.log(checkIn.data);

      if (checkIn.data) {
        // setOngoingEvent(checkIn.data);
        await storeData("joined_event", JSON.stringify(checkIn.data));

        Alert.alert("Success", `You joined the ${checkIn.data.event.name}!`);
        router.back();
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      router.back();
    } finally {
      setScanned(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <View className="flex-1 justify-center h-[100%]">
          {/* Close icon at the top right */}
          <TouchableOpacity
            className="absolute top-12 right-5 z-10"
            onPress={() => router.back()}
          >
            {/* times-circle */}
            <Icon name="window-close" size={30} color="white" />
          </TouchableOpacity>

          <CameraView
            className="flex-1"
            facing={facing}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          >
            {!scanned && (
              <View className="absolute top-40 self-center z-20">
                <Text className=" text-white text-lg font-psemibold">
                  Scanning QR Code...
                </Text>
              </View>
            )}
            {/* Top overlay */}
            <View className="absolute top-0 left-0 right-0 h-[30%] bg-black/50" />
            {/* Bottom overlay */}
            <View className="absolute bottom-0 left-0 right-0 h-[30%] bg-black/50" />
            {/* Left overlay */}
            <View className="absolute top-[30%] left-0 bottom-[30%] w-[10%] bg-black/50" />
            {/* Right overlay */}
            <View className="absolute top-[30%] right-0 bottom-[30%] w-[10%] bg-black/50" />

            {/* Square overlay for QR code alignment */}
            <View className="absolute top-[30%] left-[10%] w-[80%] h-[40%] border-2 border-secondary rounded-lg bg-transparent z-10" />
            {/* <View className="flex-1 flex-row bg-transparent m-[64px]">
              <TouchableOpacity
                className="flex-1 self-end items-center"
                onPress={toggleCameraFacing}
              >
                <Text className="text-[24] font-bold text-white">
                  Flip Camera
                </Text>
              </TouchableOpacity>
            </View> */}

            {/* Scan Again button */}
            {scanned && (
              <View className="absolute bottom-10 self-center">
                <CustomButton
                  title="Scan Again"
                  handlePress={() => setScanned(false)}
                  containerStyles="px-5"
                />
              </View>
            )}
          </CameraView>
        </View>
      )}
    </>
  );
};

export default JoinEvent;
