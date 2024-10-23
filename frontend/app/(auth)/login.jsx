import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { loginUser, getCurrentUser } from "../../lib/db";
import Loader from "../../components/reusables/Loader";

const LogIn = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn, networkStatus } = useGlobalContext();

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("error getting token", error.message);
    }
  };

  const submit = async () => {
    if (form.username === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all the fields");
    }

    setIsSubmitting(true);
    try {
      const data = await loginUser(form.username, form.password);
      const token = data.data.accessToken;
      const result = await getCurrentUser(token);

      storeData("access_token", token);

      setUser(result.data);
      setIsLoggedIn(true);

      Alert.alert("Success", "User signed in successfully!");
      router.replace("/home");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      {isSubmitting ? (
        <Loader />
      ) : (
        <ScrollView>
          <View className="w-full min-h-[85vh] justify-center px-4 my-6">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[80px] h-[80px]"
            />

            {networkStatus === null ? (
              <Text className="mt-5 text-xl text-red-500 text-semibold font-psemibold">
                You can't Login, please connect to the University WiFi.
              </Text>
            ) : (
              <Text className="text-2xl text-secondary text-semibold mt-5 font-psemibold">
                Log in to Eventswift
              </Text>
            )}

            <FormField
              title="Email or Student ID"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Log in"
              handlePress={submit}
              containerStyles="mt-7"
              // isLoading={isSubmitting}
              isLoading={networkStatus === null ? true : isSubmitting}
            />

            {networkStatus !== null ? (
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Don't have account?
              </Text>
              <Link
                href="/signup"
                className="text-lg font-psemibold text-secondary"
              >
                Sign Up
              </Link>
            </View>
            ) : null}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default LogIn;
