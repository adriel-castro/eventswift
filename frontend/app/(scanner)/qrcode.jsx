import { View, Text, Alert, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { createQRCode } from "../../lib/db";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useLocalSearchParams } from "expo-router";

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
    <View className="flex-1 justify-center p-5">
      {!isLoading && qrCodeUrl && (
        <View className="mt-5 items-center">
          <Text className="text-lg mb-4">QR Code:</Text>
          <Image source={{ uri: qrCodeUrl }} className="w-60 h-60" />
        </View>
      )}
    </View>
  );
};

export default QRCode;
