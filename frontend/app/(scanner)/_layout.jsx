import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ScannerLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="checkin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="qrcode"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#161622" />
    </>
  );
};

export default ScannerLayout;
