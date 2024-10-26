import { Text, ScrollView, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from "../../components/Accordion";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getEvents } from "../../lib/db";
import useRefresh from "../../lib/useRefresh";
import Loader from "../../components/reusables/Loader";

const Events = () => {
  const { accessToken } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: eventsData,
    loading,
    refetch,
  } = useRefresh(() => getEvents(accessToken));

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      {loading ? (
        <Loader />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text className="text-2xl px-4 mt-10 text-semibold text-secondary font-psemibold">
            Events
          </Text>
          <Accordion eventsData={eventsData} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Events;
