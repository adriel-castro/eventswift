import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ManageLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="users"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="departments"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#016738" style="light" />
    </>
  );
};

export default ManageLayout;
