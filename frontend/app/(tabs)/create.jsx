import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";

import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from "../../components/CustomButton";
import Loader from "../../components/reusables/Loader";
import FormField from "../../components/FormField";
import DropdownField from "../../components/DropdownField";
import DatePickerField from "../../components/DatePickerField";
import TimePickerField from "../../components/TimePickerField";
import { createEvent } from "../../lib/db";

const CreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken, departments: deptData } = useGlobalContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openDept, setOpenDept] = useState(false);
  const [openMandatory, setOpenMandatory] = useState(false);
  const [department, setDepartment] = useState(deptData);
  const [mandatoryItems, setMandatoryItems] = useState([
    {
      value: true,
      label: "Yes",
    },
    {
      value: false,
      label: "No",
    },
  ]);
  const [dateOfEvent, setDateOfEvent] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");

  const [event, setEvent] = useState({
    name: "",
    department: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    organizer: "",
    contact: "",
    isMandatory: false,
  });
  // console.log("dateOfEvent", dateOfEvent);
  const handleChange = (field, value) => {
    setEvent({
      ...event,
      [field]: value,
    });
  };

  const handleDateChange = (field, selectedDate) => {
    // console.log("selectedDate", selectedDate);
    setShowDatePicker(false);
    setDateOfEvent(selectedDate);
  };

  const handleTimeChange = (field, selectedTime) => {
    if (field === "startTime") {
      setEventStartTime(selectedTime);
    } else {
      setEventEndTime(selectedTime);
    }
  };

  useEffect(() => {
    if (dateOfEvent) {
      setEvent({
        ...event,
        eventDate: moment(dateOfEvent).format("YYYY-MM-DD"),
      });
    }
  }, [dateOfEvent]);

  useEffect(() => {
    if (eventStartTime) {
      setEvent({
        ...event,
        startTime: moment(eventStartTime).format("h:mm A"),
      });
    }
  }, [eventStartTime]);

  useEffect(() => {
    if (eventEndTime) {
      setEvent({ ...event, endTime: moment(eventEndTime).format("h:mm A") });
    }
  }, [eventEndTime]);

  const requiredField = () => {
    if (event.name === "") {
      return Alert.alert("Error", "Event name is required");
    } else if (event.department === "") {
      return Alert.alert("Error", "Department is required");
    } else if (event.eventDate === "") {
      return Alert.alert("Error", "Event date is required");
    } else if (event.startTime === "") {
      return Alert.alert("Error", "Start time is required");
    } else if (event.endTime === "") {
      return Alert.alert("Error", "End time is required");
    } else if (event.location === "") {
      return Alert.alert("Error", "Location is required");
    }
  };

  const submit = async () => {
    requiredField();

    setIsLoading(true);
    try {
      const res = await createEvent(event, accessToken);

      if (res.data) {
        Alert.alert("Success", "You successfully created an event!");
        setEvent({
          name: "",
          department: "",
          eventDate: "",
          startTime: "",
          endTime: "",
          location: "",
          description: "",
          organizer: "",
          contact: "",
          isMandatory: false,
        });
      }
    } catch (error) {
      Alert.alert("Error", error.message);
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={[{ key: "event" }]}
              renderItem={() => (
                <View className="w-full min-h-[85vh] justify-center px-4 my-6">
                  <Text className="text-2xl text-secondary-200 font-psemibold">
                    Create Event
                  </Text>
                  <FormField
                    title="Event Title*"
                    value={event.name}
                    placeholder="Enter Event Name"
                    handleChangeText={(e) => handleChange("name", e)}
                    otherStyles="mt-5"
                  />

                  <DropdownField
                    title="Department"
                    value={event.department}
                    placeholder="Select Department"
                    handleChange={(e) => handleChange("department", e)}
                    otherStyles="mt-5"
                    open={openDept}
                    setOpen={setOpenDept}
                    items={department}
                    setItems={setDepartment}
                  />

                  <DatePickerField
                    title="Event Date"
                    value={dateOfEvent}
                    handleChangeText={handleDateChange}
                    otherStyles="mt-5"
                    showDatePicker={showDatePicker}
                    toggleDatePicker={() => setShowDatePicker(true)}
                  />

                  <TimePickerField
                    title="Start Time"
                    value={eventStartTime}
                    handleChangeText={(time) =>
                      handleTimeChange("startTime", time)
                    }
                    otherStyles="mt-5"
                  />

                  <TimePickerField
                    title="End Time"
                    value={eventEndTime}
                    handleChangeText={(time) =>
                      handleTimeChange("endTime", time)
                    }
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Location"
                    value={event.location}
                    placeholder="Enter Location"
                    handleChangeText={(e) => handleChange("location", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Description"
                    value={event.description}
                    placeholder="Enter Description"
                    handleChangeText={(e) => handleChange("description", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Organizer"
                    value={event.organizer}
                    placeholder="Enter Organizer"
                    handleChangeText={(e) => handleChange("organizer", e)}
                    otherStyles="mt-5"
                  />

                  <DropdownField
                    title="Mandatory"
                    value={event.isMandatory}
                    placeholder="Is event mandatory?"
                    handleChange={(e) => handleChange("isMandatory", e)}
                    otherStyles="mt-5"
                    open={openMandatory}
                    setOpen={setOpenMandatory}
                    items={mandatoryItems}
                    setItems={setMandatoryItems}
                  />

                  <FormField
                    title="Organizer Info"
                    value={event.contact}
                    placeholder="Enter Organizer Info"
                    handleChangeText={(e) => handleChange("contact", e)}
                    otherStyles="mt-5"
                  />

                  <CustomButton
                    title="Submit"
                    handlePress={submit}
                    containerStyles="mt-14"
                  />
                </View>
              )}
              keyExtractor={(item) => item.key}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </>
  );
};

export default CreateEvent;
