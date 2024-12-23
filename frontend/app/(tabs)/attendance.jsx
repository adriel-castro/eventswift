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
import Icon from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import useRefresh from "../../lib/useRefresh";
import {
  eventAttendances,
  getDepartmentEvents,
  getEvents,
  getEventsFeedback,
} from "../../lib/db";
import moment from "moment";
import CustomButton from "../../components/CustomButton";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import jsPDF from "jspdf";
import Loader from "../../components/reusables/Loader";

const Attendance = () => {
  const { user, accessToken } = useGlobalContext();
  const { data: eventsData } = useRefresh(() => getEvents(accessToken));
  const { data: departmentEventsData } = useRefresh(() =>
    getDepartmentEvents(user?._id, accessToken)
  );
  const [eventsAttendance, setEventsAttendance] = useState([]);
  const filteredEvents = eventsAttendance
    ?.map((event) => {
      const filteredAttendance = Array.isArray(event.attendance)
        ? event.attendance.filter(
            (attendee) => attendee.attendee?._id === user._id
          )
        : [];
      return {
        ...event,
        attendance: filteredAttendance,
      };
    })
    .filter((event) => event.attendance.length > 0);

  const timeToMinutes = (time) => {
    const [hour, minute] = time.split(/[: ]/);
    const isPM = time.includes("PM");
    return (parseInt(hour) % 12) * 60 + parseInt(minute) + (isPM ? 720 : 0);
  };

  const sortByDateAndTime = (a, b) => {
    const dateA = new Date(a.eventName.eventDate);
    const dateB = new Date(b.eventName.eventDate);
    const dateComparison = dateB - dateA;

    if (dateComparison !== 0) return dateComparison;

    const startTimeComparison =
      timeToMinutes(b.eventName.startTime) -
      timeToMinutes(a.eventName.startTime);
    if (startTimeComparison !== 0) return startTimeComparison;

    return (
      timeToMinutes(b.eventName.endTime) - timeToMinutes(a.eventName.endTime)
    );
  };

  const eventsFiltered =
    user?.role === "admin" ? eventsAttendance : filteredEvents;
  const eventsToShow = eventsFiltered?.sort(sortByDateAndTime);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [eventsFeedback, setEventsFeedback] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const userId = user?._id;

  const fetchAttendanceData = async () => {
    const dataEvent =
      user?.role !== "admin" ? departmentEventsData : eventsData;

    if (!dataEvent) return;
    setLoading(true);
    try {
      const attendanceData = await Promise.all(
        dataEvent.map(async (event) => {
          const attendance = await eventAttendances(event._id, accessToken);
          return {
            eventName: {
              _id: event._id,
              name: event.name,
              eventDate: event.eventDate,
              startTime: event.startTime,
              endTime: event.endTime,
            },
            attendance: attendance.data.filter((a) => a.attendee !== null),
          };
        })
      );

      const allData = attendanceData.filter(
        (item) => item.attendance.length > 0
      );

      const filteredData =
        user?.role !== "admin"
          ? allData.map((a) => ({
              eventName: a?.eventName,
              attendance: a?.attendance.filter(
                (b) => b?.attendee?._id === userId
              ),
            }))
          : allData;

      // If the user is not admin and no attendance data is found, set eventsAttendance to null
      const finalData =
        filteredData.every((item) => item?.attendance.length === 0) &&
        user?.role !== "admin"
          ? null
          : filteredData;

      setEventsAttendance(finalData);

      // setEventsAttendance(filteredData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [eventsData, departmentEventsData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAttendanceData();
    setRefreshing(false);
  };

  const dataTable = (attendance) =>
    attendance
      // .filter((data) => data.attendee._id === userId)
      .map((item, index) => ({
        id: index + 1,
        studentID: item.attendee.studentID,
        fullName: `${item.attendee.firstName} ${item.attendee.lastName}`,
        timestamps: item.timestamps.length,
        status: item.timestamps.length > 3 ? "Present" : "Absent",
        duration: `${totalDuration(
          item.event.startTime,
          item.event.endTime
        )} hour(s)`,
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
    const diffInHours = end.diff(start, "hours", true);
    // Round to the nearest 0.5
    const roundedDuration = Math.round(diffInHours * 2) / 2;
    return roundedDuration;
  };

  const renderAttendanceItem = ({ item }) => {
    if (item === null) {
      return null;
    }

    return (
      <View className="flex-row border border-gray-300 py-2" key={item.id}>
        <Text className="flex-1 text-center">{item.id}</Text>
        <Text className="flex-1 text-center">{item.studentID}</Text>
        <Text className="flex-1 text-center">{item.fullName}</Text>
        <Text className="flex-1 text-center">{item.timestamps}</Text>
        <Text className="flex-1 text-center">{item.duration}</Text>
        <Text className="flex-1 text-center">{item.status}</Text>
      </View>
    );
  };

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

  const exportAttendanceData = async (attendanceData, eventName) => {
    try {
      const doc = new jsPDF("p", "mm", "a4");

      // Set margins and calculate the x position for centering content
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const tableWidth = 180; // Adjust the width of the table
      const tableX = (pageWidth - tableWidth) / 2; // Center the table horizontally

      // Add title and date, centered at the top of the page
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const title = eventName + " " + "Attendance Report";
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, margin + 10);

      // Add the current date below the title
      doc.setFontSize(12);
      const date = `Date: ${new Date().toLocaleDateString()}`;
      const dateWidth = doc.getTextWidth(date);
      doc.text(date, (pageWidth - dateWidth) / 2, margin + 20);

      // Set up table headers
      const headers = [
        "No.",
        "Student ID",
        "Full Name",
        "Timestamps",
        "Duration",
        "Status",
      ];

      const columnWidths = [20, 30, 50, 40, 30, 30]; // Adjust column widths
      const headerHeight = 8;
      let yPosition = margin + 30;

      // Draw the table header row
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      headers.forEach((header, index) => {
        const xPosition =
          tableX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0); // Calculate x position for each header
        doc.text(header, xPosition, yPosition);
      });

      // Add data rows below the header
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      attendanceData.forEach((entry, index) => {
        yPosition += 8;
        let xPosition = tableX;
        doc.text(entry.id.toString(), xPosition, yPosition);
        xPosition += columnWidths[0]; // Move x position to next column

        doc.text(entry.studentID, xPosition, yPosition);
        xPosition += columnWidths[1];

        doc.text(entry.fullName, xPosition, yPosition);
        xPosition += columnWidths[2];

        doc.text(entry.timestamps.toString(), xPosition, yPosition);
        xPosition += columnWidths[3];

        doc.text(entry.duration, xPosition, yPosition);
        xPosition += columnWidths[4];

        doc.text(entry.status, xPosition, yPosition);
      });

      // Check if content overflows and add another page if necessary
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin + 10; // Reset yPosition for the next page
      }

      const dateString = moment().format("MM_DD_YYYY_hh_mm_ss");
      const fileName = `attendance_${dateString}.pdf`;

      // Save the PDF
      const pdfBuffer = doc.output("arraybuffer");
      const pdfBase64 = arrayBufferToBase64(pdfBuffer);
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share the PDF file (on both Android and iOS)
      if (Platform.OS === "android" || Platform.OS === "ios") {
        await Sharing.shareAsync(fileUri);
      }

      // console.log("PDF saved and shared at:", fileUri);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const exportFeedbackData = async () => {
    try {
      const doc = new jsPDF("p", "mm", "a4");

      // Set margins and calculate the x position for centering content
      const margin = 10;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const tableWidth = 180; // Adjust the width of the table
      const tableX = (pageWidth - tableWidth) / 2; // Center the table horizontally

      // Add title and date, centered at the top of the page
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const title = "Feedback Report";
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, margin + 10);

      // Add the current date below the title
      doc.setFontSize(12);
      const date = `Date: ${new Date().toLocaleDateString()}`;
      const dateWidth = doc.getTextWidth(date);
      doc.text(date, (pageWidth - dateWidth) / 2, margin + 20);

      // Set up table headers
      const headers = ["No.", "Student ID", "Full Name", "Rating", "Comment"];

      // Draw the table header row
      const headerHeight = 8;
      let yPosition = margin + 30;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      headers.forEach((header, index) => {
        const xPosition = tableX + index * (tableWidth / headers.length);
        doc.text(header, xPosition, yPosition);
      });

      // Add data rows below the header
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const lineHeight = 6; // Adjust line height for row spacing
      const maxLineWidth = tableWidth / headers.length;

      // Loop through the data and draw each row
      eventsFeedback.forEach((entry, index) => {
        let currentY = yPosition + (index + 1) * lineHeight; // Start drawing the next line

        const row = [
          (index + 1).toString(),
          entry.attendee.studentID,
          entry.attendee.firstName + " " + entry.attendee.lastName,
          entry.feedback.rating.toString(),
          entry.feedback.comment,
        ];

        // Array to store wrapped text and their heights for each column in the row
        const wrappedRow = row.map((cell) =>
          doc.splitTextToSize(cell, maxLineWidth)
        );

        // Find the tallest height for the row (max number of lines in any column)
        const maxRowHeight =
          Math.max(...wrappedRow.map((text) => text.length)) * lineHeight;

        // Draw each cell in the row
        wrappedRow.forEach((wrappedText, cellIndex) => {
          const xPosition = tableX + cellIndex * (tableWidth / headers.length);
          doc.text(wrappedText, xPosition, currentY);
        });

        // Update the Y-position after drawing all columns in the row
        yPosition += maxRowHeight; // Increment by the tallest height of the row
      });

      // Calculate average rating
      const averageRating =
        eventsFeedback.length > 0
          ? eventsFeedback.reduce(
              (sum, entry) => sum + entry.feedback.rating,
              0
            ) / eventsFeedback.length
          : 0;

      // Display the average rating below the table
      const avgRatingText = `Average Rating: ${averageRating.toFixed(2)}`;
      doc.setFontSize(12);
      doc.text(avgRatingText, tableX + tableWidth / 2, yPosition + 10); // Displaying it below the table

      // Check if content overflows and add another page if necessary
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin + 10; // Reset yPosition for the next page
      }

      const dateString = moment().format("MM_DD_YYYY_hh_mm_ss");
      const fileName = `feedback_${dateString}.pdf`;

      // Save the PDF
      const pdfBuffer = doc.output("arraybuffer");
      const pdfBase64 = arrayBufferToBase64(pdfBuffer);
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS === "android" || Platform.OS === "ios") {
        await Sharing.shareAsync(fileUri);
      }

      // console.log("PDF saved and shared at:", fileUri);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    const byteArray = new Uint8Array(buffer);
    const byteString = String.fromCharCode.apply(null, byteArray);
    return btoa(byteString);
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-primary">
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            data={eventsToShow}
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
                  Attendance {eventsToShow ? `(${eventsToShow.length})` : ""}
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <View className="mb-4 p-4 border-b-2 border-gray-300 rounded">
                <View className="flex flex-row justify-between items-center mb-2">
                  <View className="mb-2">
                    <Text className="text-lg font-bold text-secondary">
                      {index + 1}. {item.eventName.name}
                    </Text>
                    <Text className="text-sm font-bold text-secondary ml-5">
                      {moment(item.eventName.eventDate).format("MMM. DD, YYYY")}
                      , {item.eventName.startTime}-{item.eventName.endTime}
                    </Text>
                  </View>
                  {user?.role !== "admin" ? null : (
                    <TouchableOpacity
                      onPress={() =>
                        exportAttendanceData(
                          dataTable(item.attendance),
                          item.eventName.name
                        )
                      }
                    >
                      <Icon name="file-export" size={18} color="#FEA13D" />
                    </TouchableOpacity>
                  )}
                </View>
                <View className="flex-row bg-[#F3F5AD] py-2">
                  <Text className="flex-1 text-center font-bold">ID</Text>
                  <Text className="flex-1 text-center font-bold">
                    Student ID
                  </Text>
                  <Text className="flex-1 text-center font-bold">
                    Full Name
                  </Text>
                  <Text className="flex-1 text-center font-bold">
                    Timestamps
                  </Text>
                  <Text className="flex-1 text-center font-bold">Duration</Text>
                  <Text className="flex-1 text-center font-bold">Status</Text>
                </View>
                <FlatList
                  data={dataTable(item.attendance)}
                  renderItem={renderAttendanceItem}
                  keyExtractor={(item) => item.id}
                />

                {/* {user?.role !== "admin" ? null : ( */}
                <TouchableOpacity
                  onPress={() => openFeedbackModal(item.eventName._id)}
                >
                  <Text className="text-secondary text-right mt-2 font-bold">
                    View Feedbacks {`>`}
                  </Text>
                </TouchableOpacity>
                {/* )} */}
              </View>
            )}
          />
        )}
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showFeedback}
        onRequestClose={() => setShowFeedback(false)}
      >
        <SafeAreaView className="bg-primary h-full">
          <View className="w-full justify-center px-4 mt-5">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View className="my-5">
                <View className="flex flex-row justify-between items-center mb-2">
                  <Text className="text-2xl px-4 text-semibold text-secondary font-psemibold">
                    Feedback
                  </Text>
                  {user?.role !== "admin" ? null : (
                    <TouchableOpacity onPress={() => exportFeedbackData()}>
                      <Icon name="file-export" size={18} color="#FEA13D" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <FlatList
                data={eventsFeedback}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item._id}
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
