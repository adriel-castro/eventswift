import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { addTimeStamps } from "./db";
import { router } from "expo-router";
import Constants from "expo-constants";

const useTimestamps = (accessToken, networkStatus) => {
  const [ongoingEvent, setOngoingEvent] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const intervalDuration = Constants.expoConfig.extra.LOG_INTERVAL;

  // console.log("ongoingEvent", ongoingEvent);

  const attendanceTimestamps = async (eventId) => {
    try {
      await addTimeStamps(eventId, accessToken);
    } catch (error) {
      Alert.alert("Error on events", error.message);
    }
  };

  const getCurrentEvent = async () => {
    try {
      const event = await AsyncStorage.getItem("joined_event");
      if (event) {
        setOngoingEvent(JSON.parse(event));
      } else {
        setOngoingEvent(null);
      }
    } catch (error) {
      console.log("Error getting current event:", error);
      setOngoingEvent(null);
    }
  };

  useEffect(() => {
    getCurrentEvent();
  }, []);

  const logTimestamps = async () => {
    if (ongoingEvent !== null && networkStatus?.ssid === "connected") {
      const event = ongoingEvent?.event;

      const eventDate = event?.eventDate.split("T")[0];
      const startTime = eventDate + " " + event?.startTime;
      const endTime = eventDate + " " + event?.endTime;
      const currentMoment = moment();

      const startMoment = moment(startTime, "YYYY-MM-DD hh:mm A");
      const endMoment = moment(endTime, "YYYY-MM-DD hh:mm A");

      // Check if event has started
      const isStarted =
        currentMoment.isSameOrAfter(startMoment) &&
        currentMoment.isSameOrBefore(endMoment);

      // Check if event has started
      if (isStarted) {
        // Set the next timestamp to log
        let nextTimestamp = startMoment
          .clone()
          .add(intervalDuration, "minutes");
        // console.log(nextTimestamp);
        const interval = setInterval(async () => {
          try {
            if (nextTimestamp.isSameOrBefore(endMoment)) {
              console.log(
                "Logging timestamp at:",
                nextTimestamp.format("hh:mm A")
              );

              await attendanceTimestamps(event?._id); // Log timestamp

              // Move to the next timestamp
              nextTimestamp.add(intervalDuration, "minutes");
            } else {
              clearInterval(interval);
              await AsyncStorage.removeItem("joined_event");
              setOngoingEvent(null);
              setIntervalId(null);
            }
          } catch (error) {
            console.error("Error logging timestamp:", error);
          }
        }, intervalDuration * 60 * 1000);

        setIntervalId(interval);
      } else if (currentMoment.isAfter(endMoment)) {
        // Event has already ended
        router.push({
          pathname: "/feedback",
          params: { eventId: event._id },
        });
        await AsyncStorage.removeItem("joined_event");
        setOngoingEvent(null);
      }
    }
  };

  // const logTimestamps = async () => {
  //   if (ongoingEvent !== null && networkStatus?.ssid === "connected") {
  //     const event = ongoingEvent?.event;
  //     const eventDate = event?.eventDate.split("T")[0];
  //     const startTime = eventDate + " " + event?.startTime;
  //     const endTime = eventDate + " " + event?.endTime;

  //     const startMoment = moment(startTime, "YYYY-MM-DD hh:mm A");
  //     const endMoment = moment(endTime, "YYYY-MM-DD hh:mm A");

  //     // Set the first logging timestamp to the first 15-minute interval after the event start time
  //     let nextTimestamp = startMoment.clone().add(intervalDuration, "minutes");

  //     const interval = setInterval(async () => {
  //       const now = moment();

  //       if (
  //         now.isSameOrAfter(nextTimestamp) &&
  //         nextTimestamp.isBefore(endMoment)
  //       ) {
  //         console.log("Logging timestamp at:", nextTimestamp.format("hh:mm A"));

  //         try {
  //           await attendanceTimestamps(event?._id);
  //           // Move to the next 15-minute interval
  //           nextTimestamp = nextTimestamp.add(intervalDuration, "minutes");
  //         } catch (error) {
  //           console.error("Error logging timestamp:", error);
  //         }
  //       }

  //       // Clear interval if the current time has passed the event end time
  //       if (now.isSameOrAfter(endMoment)) {
  //         clearInterval(interval);
  //         await AsyncStorage.removeItem("joined_event");
  //         setOngoingEvent(null);
  //         setIntervalId(null);
  //       }
  //     }, intervalDuration * 60 * 1000);

  //     setIntervalId(interval);
  //   }
  // };

  useEffect(() => {
    if (ongoingEvent) {
      logTimestamps();

      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }
  }, [ongoingEvent, accessToken, networkStatus]);

  return { ongoingEvent };
};

export default useTimestamps;
