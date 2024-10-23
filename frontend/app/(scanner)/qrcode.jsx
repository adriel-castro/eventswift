import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import { createQRCode } from "../../lib/db";
import { useGlobalContext } from "../../context/GlobalProvider";

const QRCode = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useGlobalContext();
  const { eventId } = useLocalSearchParams();

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qr = await createQRCode(eventId, accessToken);
        setQrCodeUrl(qr.data);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    generateQRCode();
  }, []);

  return (
    <View className="flex-1 justify-center p-5 bg-[#F3F5AD]">
      <TouchableOpacity
        className="absolute top-12 right-5 z-10"
        onPress={() => router.back()}
      >
        <Icon name="window-close" size={30} color="#FEA13D" />
      </TouchableOpacity>
      {!isLoading && qrCodeUrl && (
        <View className="mt-5 items-center">
          <Text className="text-lg text-secondary-200 font-psemibold mb-4">
            QR Code:
          </Text>
          <Image source={{ uri: qrCodeUrl }} className="w-60 h-60" />
        </View>
      )}
    </View>
  );
};

export default QRCode;
