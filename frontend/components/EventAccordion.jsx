import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import moment from "moment";
// import momentTZ from "moment-timezone";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "./FormField";
import DropdownField from "./DropdownField";
import { useGlobalContext } from "../context/GlobalProvider";
import DatePickerField from "./DatePickerField";
import TimePickerField from "./TimePickerField";
import { updateEvent } from "../lib/db";
import Loader from "./reusables/Loader";

const EventAccordion = ({ event, isOpen, onToggle }) => {
  const {
    user,
    accessToken,
    departments: deptData,
    ongoingEvent,
  } = useGlobalContext();
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);
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

  const [dateOfEvent, setDateOfEvent] = useState(new Date()); // Default to current date
  const [eventStartTime, setEventStartTime] = useState(new Date()); // Default to current time
  const [eventEndTime, setEventEndTime] = useState(new Date()); // Default to current time
  const [eventData, setEventData] = useState(null);
  const [eventEdit, setEventEdit] = useState([]);
  const handleShowModal = (event) => {
    setEventData(event);
    setShowEditEvent(true);
  };

  useEffect(() => {
    if (eventData !== null) {
      const obj = {
        name: eventData.name,
        department: eventData.department,
        eventDate: moment(eventData.eventDate).format("YYYY-MM-DD"),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        description: eventData.description,
        organizer: eventData?.organizer?.name,
        contact: eventData?.organizer?.contact,
        isMandatory: eventData.isMandatory ?? false,
      };
      setEventEdit(obj);
      setDateOfEvent(
        moment(eventData.eventDate, "YYYY-MM-DD")
          .utc()
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      );
      setEventStartTime(
        moment(
          eventData.eventDate + " " + eventData.startTime,
          "YYYY-MM-DD h:mm A"
        )
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      );
      setEventEndTime(
        moment(
          eventData.eventDate + " " + eventData.endTime,
          "YYYY-MM-DD h:mm A"
        )
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
      );
    }
  }, [eventData]);
  // console.log(eventData);

  const handleChange = (field, value) => {
    setEventEdit({
      ...eventEdit,
      [field]: value,
    });
  };

  // const handleChange = (field, value) => {
  //   setEventEdit((prevData) => ({
  //     ...prevData,
  //     [field]: value,
  //   }));
  // };

  // const handleDateChange = (field, selectedDate) => {
  //   setShowDatePicker(false);
  //   setDateOfEvent(selectedDate);
  // };

  const handleDateChange = (field, selectedDate) => {
    setShowDatePicker(false);
    setDateOfEvent(new Date(selectedDate));
  };

  // const handleTimeChange = (field, selectedTime) => {
  //   console.log(selectedTime);
  //   if (field === "startTime") {
  //     setEventStartTime(selectedTime);
  //   } else {
  //     setEventEndTime(selectedTime);
  //   }
  // };

  const handleTimeChange = (field, selectedTime) => {
    if (field === "startTime") {
      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(dateOfEvent); // Using the selected date
      dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      setEventStartTime(dateTime);
    } else {
      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(dateOfEvent); // Using the selected date
      dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      setEventEndTime(dateTime);
    }
  };

  useEffect(() => {
    if (dateOfEvent) {
      setEventEdit({
        ...eventEdit,
        eventDate: moment(dateOfEvent).format("YYYY-MM-DD"),
      });
    }
  }, [dateOfEvent]);

  useEffect(() => {
    if (eventStartTime) {
      setEventEdit({
        ...eventEdit,
        startTime: moment(eventStartTime).format("h:mm A"),
      });
    }
  }, [eventStartTime]);

  useEffect(() => {
    if (eventEndTime) {
      setEventEdit({
        ...eventEdit,
        endTime: moment(eventEndTime).format("h:mm A"),
      });
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
      const res = await updateEvent(eventData._id, eventEdit, accessToken);
      // console.log("response", res.data);

      if (res.data) {
        Alert.alert("Success", "You successfully updated an event!");
        setShowEditEvent(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventStatus = (eventDate, startTime, endTime) => {
    const startDateTime = moment(eventDate).set({
      hour: moment(startTime, "h:mm A").hour(),
      minute: moment(startTime, "h:mm A").minute(),
    });

    const endDateTime = moment(eventDate).set({
      hour: moment(endTime, "h:mm A").hour(),
      minute: moment(endTime, "h:mm A").minute(),
    });

    const now = moment();

    return now.isBefore(startDateTime)
      ? "Not Started"
      : now.isBetween(startDateTime, endDateTime, null, "[]")
      ? "Ongoing"
      : "Finished";
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <View>
          <TouchableOpacity
            className="flex flex-row items-center justify-between w-full p-3 border border-gray-200 rounded-lg"
            onPress={onToggle}
          >
            <Text>{event.name}</Text>
            <View className="flex flex-row gap-5">
              {user?.role === "admin" ? (
                <TouchableOpacity onPress={() => handleShowModal(event)}>
                  <Icon name="edit" size={20} color="#FEA13D" />
                </TouchableOpacity>
              ) : null}
              <Icon
                name="caret-down"
                size={15}
                color="gray"
                style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
              />
            </View>
          </TouchableOpacity>

          {isOpen && (
            <View className="p-3 border-secondary border-2">
              <Text>Date: {moment(event.eventDate).format("LL")}</Text>
              <Text>
                Time: {event.startTime} - {event.endTime}
              </Text>
              <Text>Location: {event.location}</Text>
              <Text>Description: {event.description}</Text>
              <Text>Organizer: {event.organizer.name}</Text>
              <Text>Contact Info: {event.organizer.contact || "N/A"}</Text>
              <Text>Mandatory: {event.isMandatory ? "Yes" : "No"}</Text>
              <Text>
                Status:{" "}
                {getEventStatus(
                  event.eventDate,
                  event.startTime,
                  event.endTime
                )}
              </Text>

              {user?.role === "admin" ? (
                <CustomButton
                  title="Generate QR"
                  handlePress={() =>
                    router.push({
                      pathname: "/qrcode",
                      params: { eventId: event._id },
                    })
                  }
                  containerStyles="mt-5"
                />
              ) : null}

              {ongoingEvent !== null ? null : (
                <CustomButton
                  title="Join Event"
                  handlePress={() => router.push("/join")}
                  containerStyles="mt-5"
                />
              )}

              {getEventStatus(
                event.eventDate,
                event.startTime,
                event.endTime
              ) === "Finished" ? (
                <CustomButton
                  title="Feedback"
                  handlePress={() =>
                    router.push({
                      pathname: "/feedback",
                      params: { eventId: event._id },
                    })
                  }
                  containerStyles="mt-5"
                />
              ) : null}

              {/* <Text
                className="mt-10 text-2xl"
                onPress={() =>
                  router.push({
                    pathname: "/feedback",
                    params: { eventId: event._id },
                  })
                }
              >
                Feedback
              </Text> */}
            </View>
          )}
        </View>
      )}
      <Modal
        animationType="slide" // or 'fade' for a fade effect
        transparent={true} // Makes the modal background transparent
        visible={showEditEvent}
        onRequestClose={() => setShowEditEvent(false)}
      >
        <SafeAreaView className="bg-primary h-full mb-10">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={[{ key: "event" }]}
              renderItem={() => (
                <View className="w-full min-h-[85vh] justify-center px-4 my-10">
                  <Text className="text-2xl text-secondary-200 font-psemibold">
                    Update Event
                  </Text>
                  <FormField
                    title="Event Title*"
                    value={eventEdit.name}
                    placeholder="Enter Event Name"
                    handleChangeText={(e) => handleChange("name", e)}
                    otherStyles="mt-5"
                  />

                  <DropdownField
                    title="Department"
                    value={eventEdit.department}
                    placeholder="Select Department"
                    handleChange={(e) => handleChange("department", e)}
                    otherStyles="mt-5"
                    open={open}
                    setOpen={setOpen}
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
                    value={eventEdit.location}
                    placeholder="Enter Location"
                    handleChangeText={(e) => handleChange("location", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Description"
                    value={eventEdit.description}
                    placeholder="Enter Description"
                    handleChangeText={(e) => handleChange("description", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Organizer"
                    value={eventEdit.organizer}
                    placeholder="Enter Organizer"
                    handleChangeText={(e) => handleChange("organizer", e)}
                    otherStyles="mt-5"
                  />

                  <DropdownField
                    title="Mandatory"
                    value={eventEdit.isMandatory}
                    placeholder="Is event mandatory?"
                    handleChange={(e) => handleChange("isMandatory", e)}
                    otherStyles="mt-5"
                    open={open}
                    setOpen={setOpen}
                    items={mandatoryItems}
                    setItems={setMandatoryItems}
                  />

                  <FormField
                    title="Organizer Info"
                    value={eventEdit.contact}
                    placeholder="Enter Organizer Info"
                    handleChangeText={(e) => handleChange("contact", e)}
                    otherStyles="mt-5"
                  />

                  <CustomButton
                    title="Update"
                    handlePress={submit}
                    containerStyles="mt-14"
                  />

                  <CustomButton
                    title="Close"
                    handlePress={() => setShowEditEvent(false)}
                    containerStyles="mt-5"
                  />
                </View>
              )}
              keyExtractor={(item) => item.key}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default EventAccordion;