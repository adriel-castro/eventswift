import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import useRefresh from "../../lib/useRefresh";
import { eventAttendances, getEvents, getEventsFeedback } from "../../lib/db";
import moment from "moment";
import Loader from "../../components/reusables/Loader";
import CustomButton from "../../components/CustomButton";

const Attendance = () => {
  const { user, accessToken } = useGlobalContext();
  const { data: eventsData } = useRefresh(() => getEvents(accessToken));
  const [eventsAttendance, setEventsAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsFeedback, setEventsFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const dataTable = (attendance) =>
    attendance.map((item, index) => ({
      id: index + 1,
      studentID: item.attendee.studentID,
      fullName: `${item.attendee.firstName} ${item.attendee.lastName}`,
      timestamps: item.timestamps.length,
      duration: `${totalDuration(
        item.event.startTime,
        item.event.endTime
      )} hours`,
    }));

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

  const totalDuration = (startTime, endTime) => {
    const start = moment(startTime, "h:mm A");
    const end = moment(endTime, "h:mm A");
    return end.diff(start, "hours", true);
  };

  const renderAttendanceItem = ({ item }) => (
    <View className="flex-row border border-gray-300 py-2" key={item.id}>
      <Text className="flex-1 text-center">{item.id}</Text>
      <Text className="flex-1 text-center">{item.studentID}</Text>
      <Text className="flex-1 text-center">{item.fullName}</Text>
      <Text className="flex-1 text-center">{item.timestamps}</Text>
      <Text className="flex-1 text-center">{item.duration}</Text>
    </View>
  );

  const renderFeedbackItem = ({ item }) => (
    <View className="flex-row border border-gray-300 py-2 px-2">
      <Text className="flex-1 text-center">{item.attendee.studentID}</Text>
      <Text className="flex-1 text-center">
        {item.attendee.firstName} {item.attendee.lastName}
      </Text>
      <Text className="flex-1 text-center">{item.feedback.rating}</Text>
      <Text className="flex-1 text-center">{item.feedback.comment}</Text>
    </View>
  );

  return (
    <>
      <SafeAreaView className="flex-1 bg-primary">
        <FlatList
          data={eventsAttendance}
          keyExtractor={(item) => item.eventName._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <View className="mt-10">
              {/* <Text className="text-2xl text-secondary font-bold text-center">
                Attendance
              </Text> */}
              <Text className="text-2xl px-4 text-semibold text-secondary font-psemibold">
                Attendance
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mb-4 p-4 border border-gray-300 rounded">
              <Text className="text-lg font-bold text-secondary mb-2">
                {item.eventName.name}
              </Text>
              <View className="flex-row bg-[#F3F5AD] py-2">
                <Text className="flex-1 text-center font-bold">ID</Text>
                <Text className="flex-1 text-center font-bold">Student ID</Text>
                <Text className="flex-1 text-center font-bold">Full Name</Text>
                <Text className="flex-1 text-center font-bold">Timestamps</Text>
                <Text className="flex-1 text-center font-bold">Duration</Text>
              </View>
              <FlatList
                data={dataTable(item.attendance)}
                renderItem={renderAttendanceItem}
                keyExtractor={(item) => item.id}
              />

              {user?.role !== "admin" ? null : (
                <TouchableOpacity
                  onPress={() => openFeedbackModal(item.eventName._id)}
                >
                  <Text className="text-secondary text-right mt-2 font-bold">
                    View Feedbacks {`>`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFeedback}
        onRequestClose={() => setShowFeedback(false)}
      >
        <SafeAreaView className="bg-primary h-full">
          <View className="w-full justify-center px-4">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View className="my-5">
                <Text className="text-2xl px-4 text-semibold text-secondary font-psemibold">
                  Feedback
                </Text>
              </View>
              <FlatList
                data={eventsFeedback}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item._id} // Use the _id as the unique key
                ListHeaderComponent={
                  <View className="flex-row bg-[#F3F5AD] py-2">
                    <Text className="flex-1 text-center font-bold">
                      Student ID
                    </Text>
                    <Text className="flex-1 text-center font-bold">
                      Full Name
                    </Text>
                    <Text className="flex-1 text-center font-bold">Rating</Text>
                    <Text className="flex-1 text-center font-bold">
                      Comment
                    </Text>
                  </View>
                }
              />
              <CustomButton
                title="Close"
                handlePress={() => setShowFeedback(false)}
                containerStyles="mt-5"
              />
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Attendance;
