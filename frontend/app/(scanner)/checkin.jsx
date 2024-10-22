import { Alert, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import CustomButton from "../../components/CustomButton";
import Icon from "react-native-vector-icons/FontAwesome5";
import { router } from "expo-router";

const CheckIn = () => {
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
    // Make a POST request to the backend API to send the scanned QR code data
    // try {
    //   const response = await fetch("http://your-backend-url/api/qr-scan", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ qrData: data }),
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     console.log("Server Response:", result.message);
    //   } else {
    //     console.error("Failed to send QR code data to server.");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  const handleClose = () => {
    router.back(); // Go back to the previous screen
  };

  return (
    <View className="flex-1 justify-center h-[100%]">
      {/* Close icon at the top right */}
      <TouchableOpacity
        className="absolute top-12 right-5 z-10"
        onPress={handleClose}
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
            <Text className="text-[24] font-bold text-white">Flip Camera</Text>
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
  );
};

export default CheckIn;
