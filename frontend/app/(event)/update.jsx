import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from "../../components/CustomButton";
import Loader from "../../components/reusables/Loader";
import {} from "../../lib/db";
import FormField from "../../components/FormField";

const UpdateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useGlobalContext();

  const handleChange = (field, value) => {
    let processedValue = value;

    if (field === "rating") {
      processedValue = value.replace(/[^0-9]/g, 0);
    }

    setFeedback({
      ...feedback,
      [field]: field === "rating" ? Number(processedValue) : processedValue,
    });
  };

  const submit = async () => {
    if (feedback.rating === 0) {
      return Alert.alert("Error", "Please add event rating.");
    } else if (feedback.rating <= 0 || feedback.rating > 5) {
      return Alert.alert("Error", "Rating must be in 1-5 range.");
    }

    setIsLoading(true);
    try {
      await createFeedback(eventId, accessToken, feedback);
      Alert.alert("Success", "You successfully submitted event feedback!");
      router.push("/home");
      setFeedback({
        rating: 0,
        comment: "",
      });
    } catch (error) {
      Alert.alert("Error", error.message);
      router.push("/home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <SafeAreaView className="bg-primary h-full mb-10">
          <View className="w-full min-h-[85vh] justify-center px-4 my-6">
            <Text className="text-2xl text-secondary-200 font-psemibold mb-4">
              Feedback
            </Text>

            <FormField
              title="Event Rating*"
              value={feedback.rating}
              placeholder="1-5"
              handleChangeText={(e) => handleChange("rating", e)}
              otherStyles="mt-5"
            />

            <FormField
              title="Comments"
              value={feedback.comment}
              placeholder="Comments/Suggestions/Complaints"
              handleChangeText={(e) => handleChange("comment", e)}
              otherStyles="mt-5"
            />

            <CustomButton
              title="Submit"
              handlePress={submit}
              containerStyles="mt-5"
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default UpdateEvent;
