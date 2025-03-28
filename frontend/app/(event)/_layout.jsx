import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const FeedbackLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="feedback"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="update"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#016738" style="light" />
    </>
  );
};

export default FeedbackLayout;
