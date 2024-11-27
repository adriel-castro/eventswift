import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { addTimeStamps } from "./db";
import { router } from "expo-router";
import Constants from "expo-constants";

const useTimestamps = (accessToken, networkStatus) => {
  const [ongoingEvent, setOngoingEvent] = useState(null);
  const intervalDuration = Constants.expoConfig.extra.LOG_INTERVAL || 15; // Default: 15 minutes
  let intervalId = null;

  // Helper to log attendance timestamps
  const attendanceTimestamps = useCallback(
    async (eventId) => {
      try {
        await addTimeStamps(eventId, accessToken);
      } catch (error) {
        console.error("Error logging timestamp:", error);
        Alert.alert("Error on events", error.message);
      }
    },
    [accessToken]
  );

  // Helper to calculate and validate event timing
  const isEventOngoing = (startMoment, endMoment) => {
    const currentMoment = moment();
    if (currentMoment.isAfter(endMoment)) {
      return "ENDED";
    }
    if (currentMoment.isSameOrAfter(startMoment)) {
      return "ONGOING";
    }
    return "NOT_STARTED";
  };

  // Logs timestamps at regular intervals
  const startLoggingTimestamps = useCallback(
    (event) => {
      const eventDate = event?.eventDate.split("T")[0];
      const startMoment = moment(
        `${eventDate} ${event.startTime}`,
        "YYYY-MM-DD hh:mm A"
      );
      const endMoment = moment(
        `${eventDate} ${event.endTime}`,
        "YYYY-MM-DD hh:mm A"
      );

      const eventStatus = isEventOngoing(startMoment, endMoment);

      if (eventStatus === "ENDED") {
        router.push({
          pathname: "/feedback",
          params: { eventId: event._id },
        });
        AsyncStorage.removeItem("joined_event");
        setOngoingEvent(null);
        return;
      }

      if (eventStatus === "ONGOING") {
        let nextTimestamp = moment
          .max(moment(), startMoment)
          .clone()
          .add(intervalDuration, "minutes");

        intervalId = setInterval(async () => {
          const currentMoment = moment();
          if (currentMoment.isAfter(endMoment)) {
            clearInterval(intervalId);
            AsyncStorage.removeItem("joined_event");
            setOngoingEvent(null);
          } else if (currentMoment.isSameOrAfter(nextTimestamp)) {
            console.log("Logging timestamp");
            await attendanceTimestamps(event._id);
            nextTimestamp.add(intervalDuration, "minutes");
          }
        }, intervalDuration * 60 * 1000);
      }
    },
    [attendanceTimestamps, intervalDuration]
  );

  // Fetch the current event from AsyncStorage
  const getCurrentEvent = useCallback(async () => {
    try {
      const event = await AsyncStorage.getItem("joined_event");
      if (event) {
        const parsedEvent = JSON.parse(event);
        setOngoingEvent(parsedEvent);
        startLoggingTimestamps(parsedEvent.event);
      } else {
        setOngoingEvent(null);
      }
    } catch (error) {
      console.error("Error getting current event:", error);
      setOngoingEvent(null);
    }
  }, [startLoggingTimestamps]);

  // Clear interval when dependencies change or component unmounts
  const clearLoggingInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  useEffect(() => {
    getCurrentEvent();

    return () => {
      clearLoggingInterval();
    };
  }, [getCurrentEvent]);

  useEffect(() => {
    if (
      ongoingEvent !== null &&
      accessToken !== null &&
      networkStatus !== null
    ) {
      const timeout = setTimeout(() => {
        startLoggingTimestamps(ongoingEvent.event);
      }, intervalDuration * 60 * 1000);
      return () => clearTimeout(timeout);
    }

    return () => {
      clearLoggingInterval();
    };
  }, [ongoingEvent, accessToken, networkStatus, startLoggingTimestamps]);

  return { ongoingEvent };
};

export default useTimestamps;
