import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import DataTable from "react-native-datatable-component";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import useRefresh from "../../lib/useRefresh";
import { eventAttendances, getEvents, getEventsFeedback } from "../../lib/db";
import moment from "moment";
import Loader from "../../components/reusables/Loader";
import CustomButton from "../../components/CustomButton";

const Attendance = () => {
  const { accessToken } = useGlobalContext();
  const { data: eventsData } = useRefresh(() => getEvents(accessToken));
  const [eventsAttendance, setEventsAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsFeedback, setEventsFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // console.log(eventsFeedback);

  // Fetch attendance for each event and include the event title
  const fetchAttendanceData = async () => {
    if (!eventsData) return;
    setLoading(true);
    try {
      const attendanceData = await Promise.all(
        eventsData.map(async (event) => {
          const attendance = await eventAttendances(event._id, accessToken);
          return {
            eventName: { _id: event._id, name: event.name },
            attendance: attendance.data,
          };
        })
      );

      // Filter out empty attendance data
      const allData = attendanceData.filter(
        (item) => item.attendance.length > 0
      );

      setEventsAttendance(allData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [eventsData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceData();
    setRefreshing(false);
  };

  const colNames = ["id", "studentID", "fullName", "timestamps", "duration"];
  const colSettings = [
    { name: "id", sortable: true },
    { name: "studentID", sortable: true },
    { name: "fullName", sortable: true },
    { name: "timestamps", sortable: true },
    { name: "duration", sortable: true },
  ];

  const fetchFeedback = async (id) => {
    setLoading(true);
    try {
      const res = await getEventsFeedback(id, accessToken);
      setEventsFeedback(res.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openFeedbackModal = async (eventId) => {
    fetchFeedback(eventId);
    setShowFeedback(true);
  };

  const dataTable = (attendance) => {
    return attendance.map((item, index) => ({
      id: index + 1,
      studentID: item.attendee.studentID,
      fullName: `${item.attendee.firstName} ${item.attendee.lastName}`,
      timestamps: item.timestamps.length,
      duration: `${totalDuration(
        item.event.startTime,
        item.event.endTime
      )} hours`,
    }));
  };

  const filteredFeedbackData = eventsFeedback.map((item, index) => ({
    id: index + 1,
    studentID: item.attendee.studentID,
    fullName:
      item.attendee.firstName.charAt(0).toUpperCase() +
      item.attendee.firstName.slice(1) +
      " " +
      item.attendee.lastName.charAt(0).toUpperCase() +
      item.attendee.lastName.slice(1),
    rating: item.feedback.rating,
    comment: item.feedback.comment,
  }));

  const totalDuration = (startTime, endTime) => {
    const start = moment(startTime, "h:mm A");
    const end = moment(endTime, "h:mm A");
    return end.diff(start, "hours", true);
  };

  return (
    <>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text className="text-2xl px-4 mt-10 text-semibold text-secondary font-psemibold">
            Attendance
          </Text>
          {loading ? (
            <Loader />
          ) : (
            <>
              {eventsAttendance.map((eventData, index) => (
                <View key={index} className="mt-5 px-5">
                  <Text className="text-lg text-psemibold text-secondary font-psemibold">
                    {eventData.eventName.name}
                  </Text>
                  <DataTable
                    data={dataTable(eventData.attendance)}
                    colNames={colNames}
                    colSettings={colSettings}
                    noOfPages={Math.ceil(eventData.attendance.length / 5)}
                    backgroundColor="#f9f9f9"
                    headerLabelStyle={{ color: "black", fontWeight: "bold" }}
                    render={(data, idx) => (
                      <View
                        key={idx}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text>{data.id}</Text>
                        <Text>{data.studentID}</Text>
                        <Text>{data.fullName}</Text>
                        <Text>{data.timestamps}</Text>
                        <Text>{data.duration}</Text>
                      </View>
                    )}
                  />
                  <View>
                    <TouchableOpacity
                      onPress={() => openFeedbackModal(eventData.eventName._id)}
                    >
                      <Text className="text-md mt-2 text-right text-psemibold text-secondary font-psemibold">
                        View Feedbacks {`>`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Feedback Modal */}
      <Modal
        animationType="slide" // or 'fade' for a fade effect
        transparent={true} // Makes the modal background transparent
        visible={showFeedback}
        onRequestClose={() => setShowFeedback(false)}
      >
        <SafeAreaView className="bg-primary h-full mb-10">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={[{ key: "feedback" }]}
              renderItem={() => (
                <View className="w-full justify-center px-4 mt-10 mb-10">
                  <Text className="text-2xl text-secondary-200 font-psemibold">
                    Feedbacks
                  </Text>

                  <DataTable
                    data={filteredFeedbackData}
                    colNames={[
                      "id",
                      "studentID",
                      "fullName",
                      "rating",
                      "comment",
                    ]}
                    colSettings={[
                      { name: "id", sortable: true },
                      { name: "studentID", sortable: true },
                      { name: "fullName", sortable: true },
                      { name: "rating", sortable: true },
                      { name: "comment", sortable: true },
                    ]}
                    noOfPages={Math.ceil(filteredFeedbackData.length / 10)}
                    backgroundColor="#f9f9f9" // Background color for table
                    headerLabelStyle={{ color: "black", fontWeight: "bold" }}
                  />

                  <CustomButton
                    title="Close"
                    handlePress={() => setShowFeedback(false)}
                    containerStyles="mt-10"
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

export default Attendance;
