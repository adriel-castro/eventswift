import {
  View,
  Text,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { getCurrentUser, signUpUser } from "../../lib/db";
import { useGlobalContext } from "../../context/GlobalProvider";
import DropdownField from "../../components/DropdownField";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const [form, setForm] = useState({
    email: "",
    studentID: "",
    password: "",
    firstName: "",
    lastName: "",
    department: "",
    year: "",
    // birthDate: new Date(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    setUser,
    setIsLoggedIn,
    departments: deptData,
    setAccessToken,
  } = useGlobalContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState(deptData);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("Error storing token:", error.message || "Unknown error");
    }
  };

  const submit = async () => {
    if (
      form.email === "" ||
      form.studentID === "" ||
      form.firstName === "" ||
      form.lastName === "" ||
      form.department === "" ||
      form.year === "" ||
      form.password === "" ||
      confirmPassword === ""
    ) {
      return Alert.alert("Error", "Please fill in all the fields");
    }

    setIsSubmitting(true);
    try {
      if (form.password === confirmPassword) {
        // const res = await signUpUser(form);
        await signUpUser(form);

        // if (res.data) {
        //   const token = res.data.accessToken;
        //   const result = await getCurrentUser(token);

        //   setAccessToken(token);
        //   await storeData("access_token", token);

        //   if (result.data) {
        //     setUser(result.data);
        //     setIsLoggedIn(true);

        //     Alert.alert("Success", "You have signed up successfully!");
        //     router.replace("/home");
        //   }
        // }
        Alert.alert("Success", "You have signed up successfully!");
        router.replace("/login");
      } else {
        Alert.alert("Error", "Passwords do not match!");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full mb-10">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // style={{ flex: 1 }}
      >
        <FlatList
          data={[{ key: "form" }]}
          renderItem={() => (
            <View className="w-full h-full justify-center px-4 my-6">
              <Image
                source={images.logo}
                resizeMode="contain"
                className="w-[80px] h-[80px]"
              />
              <Text className="text-2xl text-secondary text-semibold mt-5 font-psemibold">
                Sign up to Eventswift
              </Text>

              <FormField
                title="Email"
                value={form.email}
                placeholder="Enter your Email"
                handleChangeText={(e) => handleChange("email", e)}
                otherStyles="mt-7"
                keyboardType="email-address"
              />

              <FormField
                title="Student ID"
                value={form.studentID}
                placeholder="Enter your ID Number"
                handleChangeText={(e) => handleChange("studentID", e)}
                otherStyles="mt-5"
              />

              <FormField
                title="First Name"
                value={form.firstName}
                placeholder="Enter your First Name"
                handleChangeText={(e) => handleChange("firstName", e)}
                otherStyles="mt-5"
              />

              <FormField
                title="Last Name"
                value={form.lastName}
                placeholder="Enter your Last Name"
                handleChangeText={(e) => handleChange("lastName", e)}
                otherStyles="mt-5"
              />

              <DropdownField
                title="Department"
                value={form.department}
                placeholder="Select Department"
                handleChange={(e) => handleChange("department", e)}
                otherStyles="mt-5"
                open={open}
                setOpen={setOpen}
                items={departments}
                setItems={setDepartments}
              />

              <FormField
                title="Year"
                value={form.year}
                placeholder="Enter Year Level"
                handleChangeText={(e) => handleChange("year", e)}
                otherStyles="mt-5"
              />

              <FormField
                title="Password"
                value={form.password}
                placeholder="Enter your Password"
                handleChangeText={(e) => handleChange("password", e)}
                otherStyles="mt-5"
                secureTextEntry
              />

              <FormField
                title="Confirm Password"
                value={confirmPassword}
                placeholder="Confirm your Password"
                handleChangeText={(e) => setConfirmPassword(e)}
                otherStyles="mt-5"
                secureTextEntry
              />

              <CustomButton
                title="Sign Up"
                handlePress={submit}
                containerStyles="mt-10"
                isLoading={isSubmitting}
              />

              <View className="justify-center pt-5 my-5 flex-row gap-2">
                <Text className="text-lg text-gray-100 font-pregular">
                  Have an account already?
                </Text>
                <Link
                  href="/login"
                  className="text-lg font-psemibold text-secondary"
                >
                  Log In
                </Link>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.key}
        />
        {/* <ScrollView>
          <View className="w-full h-full justify-center px-4 my-6">
            <Image
              source={images.logo}
              resizeMode="contain"
              className="w-[115px] h-[35px]"
            />
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Sign up to Aora
            </Text>

            <FormField
              title="Email"
              value={form.email}
              placeholder="Enter your Email"
              handleChangeText={(e) => handleChange("email", e)}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Student ID"
              value={form.studentID}
              placeholder="Enter your ID Number"
              handleChangeText={(e) => handleChange("studentID", e)}
              otherStyles="mt-5"
            />

            <FormField
              title="First Name"
              value={form.firstName}
              placeholder="Enter your First Name"
              handleChangeText={(e) => handleChange("firstName", e)}
              otherStyles="mt-5"
            />

            <FormField
              title="Last Name"
              value={form.lastName}
              placeholder="Enter your Last Name"
              handleChangeText={(e) => handleChange("lastName", e)}
              otherStyles="mt-5"
            />

            <FormField
              title="Birth Date"
              value={form.birthDate}
              handleChangeText={handleDateChange}
              otherStyles="mt-5"
              showDatePicker={showDatePicker}
              toggleDatePicker={() => setShowDatePicker(true)}
            />

            <FormField
              title="Department"
              value={form.department}
              placeholder="Select Department"
              handleChangeText={(e) => handleChange("department", e)}
              otherStyles="mt-5"
            />

            <DropdownField
              title="Department"
              value={form.department}
              placeholder="Select Department"
              handleChange={(e) => handleChange("department", e)}
              otherStyles="mt-5"
              open={open}
              setOpen={setOpen}
              items={departments}
              setItems={setDepartments}
            />

            <FormField
              title="Year"
              value={form.year}
              placeholder="Enter Year Level"
              handleChangeText={(e) => handleChange("year", e)}
              otherStyles="mt-5"
            />

            <FormField
              title="Password"
              value={form.password}
              placeholder="Enter your Password"
              handleChangeText={(e) => handleChange("password", e)}
              otherStyles="mt-5"
              secureTextEntry
            />

            <FormField
              title="Confirm Password"
              value={confirmPassword}
              placeholder="Confirm your Password"
              handleChangeText={(e) => setConfirmPassword(e)}
              otherStyles="mt-5"
              secureTextEntry
            />

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-10"
              isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 my-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Have an account already?
              </Text>
              <Link
                href="/login"
                className="text-lg font-psemibold text-secondary"
              >
                Log In
              </Link>
            </View>
          </View>
        </ScrollView> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
