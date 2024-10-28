import { Text, ScrollView, RefreshControl, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getEvents } from "../../lib/db";
import useRefresh from "../../lib/useRefresh";
import Loader from "../../components/reusables/Loader";
import AccordionItem from "../../components/AccordionItem";

const Home = () => {
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
          <View className="p-4">
            <AccordionItem eventsData={eventsData} refetch={refetch} />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Home;
