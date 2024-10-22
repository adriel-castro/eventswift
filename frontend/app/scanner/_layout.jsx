import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import CustomButton from "../../components/CustomButton";

const ScannerLayout = () => {
  // const [facing, setFacing] = useState("back");
  const facing = "back";
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
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

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    Alert.alert("Event", `QR code with data ${data} has been scanned!`);
  };

  return (
    <View className="flex-1 justify-center">
      <CameraView
        className="flex-1"
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
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
            <Text className="text-[24] font-bold text-white">Flip Camera</Text>
          </TouchableOpacity>
        </View> */}
      </CameraView>
    </View>
  );
};

export default ScannerLayout;
