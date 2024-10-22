import { Text, ScrollView, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from "../../components/Accordion";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getEvents } from "../../lib/db";

const Home = () => {
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useGlobalContext();

  useEffect(() => {
    const getAllEvents = async () => {
      setIsLoading(true);
      try {
        const res = await getEvents(accessToken);
        setEventsData(res.data);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAllEvents();
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <Text className="text-2xl px-4 mt-10 text-semibold text-secondary font-psemibold">
          Events
        </Text>
        <Accordion eventsData={eventsData} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
