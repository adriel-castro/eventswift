import {
  Text,
  ScrollView,
  RefreshControl,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createNewEvent, getDepartmentEvents, getEvents } from "../../lib/db";
import useRefresh from "../../lib/useRefresh";
import Loader from "../../components/reusables/Loader";
import AccordionItem from "../../components/AccordionItem";
import { icons } from "../../constants";
import FormField from "../../components/FormField";
import DropdownField from "../../components/DropdownField";
import TimePickerField from "../../components/TimePickerField";
import DatePickerField from "../../components/DatePickerField";
import CustomButton from "../../components/CustomButton";
import moment from "moment";

const Events = () => {
  const { user, accessToken, departments: deptData } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: eventsData,
    setData: setEventData,
    loading,
    refetch,
  } = useRefresh(() => getEvents(accessToken));
  const {
    data: departmentEventsData,
    loading: eventDeptLoader,
    refetch: refetchEventDept,
  } = useRefresh(() => getDepartmentEvents(user?._id, accessToken));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventLoader, setEventLoader] = useState(false);
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
  const [eventStartTime, setCreateEventStartTime] = useState("");
  const [eventEndTime, setCreateEventEndTime] = useState("");
  const [createEvent, setCreateEvent] = useState({
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

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refetchEventDept();
    setRefreshing(false);
  };

  const handleChange = (field, value) => {
    setCreateEvent({
      ...createEvent,
      [field]: value,
    });
  };

  const handleDateChange = (field, selectedDate) => {
    setShowDatePicker(false);
    setDateOfEvent(selectedDate);
  };

  const handleTimeChange = (field, selectedTime) => {
    if (field === "startTime") {
      setCreateEventStartTime(selectedTime);
    } else {
      setCreateEventEndTime(selectedTime);
    }
  };

  useEffect(() => {
    if (dateOfEvent) {
      setCreateEvent({
        ...createEvent,
        eventDate: moment(dateOfEvent).format("YYYY-MM-DD"),
      });
    }
  }, [dateOfEvent]);

  useEffect(() => {
    if (eventStartTime) {
      setCreateEvent({
        ...createEvent,
        startTime: moment(eventStartTime).format("h:mm A"),
      });
    }
  }, [eventStartTime]);

  useEffect(() => {
    if (eventEndTime) {
      setCreateEvent({
        ...createEvent,
        endTime: moment(eventEndTime).format("h:mm A"),
      });
    }
  }, [eventEndTime]);

  const requiredField = () => {
    if (createEvent.name === "") {
      return Alert.alert("Error", "Event name is required");
    } else if (createEvent.department === "") {
      return Alert.alert("Error", "Department is required");
    } else if (createEvent.eventDate === "") {
      return Alert.alert("Error", "Event date is required");
    } else if (createEvent.startTime === "") {
      return Alert.alert("Error", "Start time is required");
    } else if (createEvent.endTime === "") {
      return Alert.alert("Error", "End time is required");
    } else if (createEvent.location === "") {
      return Alert.alert("Error", "Location is required");
    }
  };

  const submit = async () => {
    requiredField();

    setEventLoader(true);
    try {
      const res = await createNewEvent(createEvent, accessToken);

      if (res.data) {
        setEventData((prevItems) => [...prevItems, res.data]);
        Alert.alert("Success", "You successfully created an event!");
        setCreateEvent({
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
        setShowCreateEvent(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setEventLoader(false);
    }
  };

  return (
    <>
      <SafeAreaView className="bg-primary h-full">
        {loading && eventDeptLoader && eventLoader ? (
          <Loader />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="flex-1 flex-row justify-between items-center mt-10">
              <Text className="text-2xl px-4  text-semibold text-secondary font-psemibold">
                Events
              </Text>
              <TouchableOpacity
                className="px-4 flex flex-row"
                onPress={() => setShowCreateEvent(true)}
              >
                <Image
                  source={icons.plus}
                  resizeMode="contain"
                  tintColor="#FEA13D"
                  className="w-8 h-8"
                />
              </TouchableOpacity>
            </View>
            {user?.role === "admin" ? (
              eventsData && eventsData.length <= 0 ? null : (
                <View className="p-4">
                  <AccordionItem eventsData={eventsData} refetch={refetch} />
                </View>
              )
            ) : departmentEventsData &&
              departmentEventsData.length <= 0 ? null : (
              <View className="p-4">
                <AccordionItem
                  eventsData={departmentEventsData}
                  refetch={refetchEventDept}
                />
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>

      <Modal
        animationType="slide" // or 'fade' for a fade effect
        transparent={true} // Makes the modal background transparent
        visible={showCreateEvent}
        onRequestClose={() => setShowCreateEvent(false)}
      >
        <SafeAreaView className="bg-primary h-full mb-10">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={[{ key: "event" }]}
              renderItem={() => (
                <View className="w-full min-h-[85vh] justify-center px-4 mt-16 mb-10">
                  <Text className="text-2xl text-secondary-200 font-psemibold">
                    Create Event
                  </Text>
                  <FormField
                    title="Event Title*"
                    value={createEvent.name}
                    placeholder="Enter Event Name"
                    handleChangeText={(e) => handleChange("name", e)}
                    otherStyles="mt-5"
                  />

                  <DropdownField
                    title="Department"
                    value={createEvent.department}
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
                    value={createEvent.location}
                    placeholder="Enter Location"
                    handleChangeText={(e) => handleChange("location", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Description"
                    value={createEvent.description}
                    placeholder="Enter Description"
                    handleChangeText={(e) => handleChange("description", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Organizer"
                    value={createEvent.organizer}
                    placeholder="Enter Organizer"
                    handleChangeText={(e) => handleChange("organizer", e)}
                    otherStyles="mt-5"
                  />

                  <DropdownField
                    title="Mandatory"
                    value={createEvent.isMandatory}
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
                    value={createEvent.contact}
                    placeholder="Enter Organizer Info"
                    handleChangeText={(e) => handleChange("contact", e)}
                    otherStyles="mt-5"
                  />

                  <CustomButton
                    title="Create"
                    handlePress={submit}
                    containerStyles="mt-14"
                  />

                  <CustomButton
                    title="Cancel"
                    handlePress={() => setShowCreateEvent(false)}
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

export default Events;
