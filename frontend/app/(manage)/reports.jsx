import { View, Text, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import { BarChart } from "react-native-gifted-charts";
import { getAllFeedback } from "../../lib/db";
import useRefresh from "../../lib/useRefresh";
import moment from "moment";

const Reports = () => {
  // const barData = [
  //   {
  //     value: 40,
  //     label: "Jan",
  //     spacing: 2,
  //     labelWidth: 30,
  //     labelTextStyle: { color: "gray" },
  //     frontColor: "#177AD5",
  //   },
  //   { value: 20, frontColor: "#ED6665" },
  //   {
  //     value: 50,
  //     label: "Feb",
  //     spacing: 2,
  //     labelWidth: 30,
  //     labelTextStyle: { color: "gray" },
  //     frontColor: "#177AD5",
  //   },
  //   { value: 40, frontColor: "#ED6665" },
  //   {
  //     value: 75,
  //     label: "Mar",
  //     spacing: 2,
  //     labelWidth: 30,
  //     labelTextStyle: { color: "gray" },
  //     frontColor: "#177AD5",
  //   },
  //   { value: 25, frontColor: "#ED6665" },
  //   {
  //     value: 30,
  //     label: "Apr",
  //     spacing: 2,
  //     labelWidth: 30,
  //     labelTextStyle: { color: "gray" },
  //     frontColor: "#177AD5",
  //   },
  //   { value: 20, frontColor: "#ED6665" },
  //   {
  //     value: 60,
  //     label: "May",
  //     spacing: 2,
  //     labelWidth: 30,
  //     labelTextStyle: { color: "gray" },
  //     frontColor: "#177AD5",
  //   },
  //   { value: 40, frontColor: "#ED6665" },
  //   {
  //     value: 65,
  //     label: "Jun",
  //     spacing: 2,
  //     labelWidth: 30,
  //     labelTextStyle: { color: "gray" },
  //     frontColor: "#177AD5",
  //   },
  //   { value: 30, frontColor: "#ED6665" },
  // ];

  const { accessToken } = useGlobalContext();
  const {
    data: eventFeedbackData,
    loading,
    refetch,
  } = useRefresh(() => getAllFeedback(accessToken));
  const [refreshing, setRefreshing] = useState(false);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    if (eventFeedbackData) {
      // Filter unique events by event ID
      const uniqueEvents = eventFeedbackData.filter(
        (event, index, self) =>
          index === self.findIndex((e) => e.event === event.event) // unique by event ID
      );

      const groupedData = {};

      uniqueEvents.forEach((event) => {
        const eventDate = moment(event.createdAt);
        const shortMonth = eventDate.format("MMM");

        if (!groupedData[shortMonth])
          groupedData[shortMonth] = { eventCount: 0, feedbackCount: 0 };

        groupedData[shortMonth].eventCount += 1; // Count unique events
      });

      eventFeedbackData.forEach((event) => {
        const eventDate = moment(event.createdAt);
        const shortMonth = eventDate.format("MMM");

        if (!groupedData[shortMonth])
          groupedData[shortMonth] = { eventCount: 0, feedbackCount: 0 };

        groupedData[shortMonth].feedbackCount += event.feedback ? 1 : 0; // Count feedback
      });

      const newBarData = Object.entries(groupedData).map(([month, counts]) => [
        {
          value: counts.eventCount,
          label: month,
          spacing: 2,
          labelWidth: 30,
          frontColor: "#016738",
        },
        {
          value: counts.feedbackCount,
          frontColor: "#FEA13D",
        },
      ]);

      setBarData(newBarData.flat());
    }
  }, [eventFeedbackData]);

  // useEffect(() => {
  //   if (eventFeedbackData) {
  //     const uniqueEvents = eventFeedbackData.filter(
  //       (event, index, self) =>
  //         index === self.findIndex((e) => e.event === event.event)
  //     );

  //     const newBarData = [
  //       {
  //         value: uniqueEvents.length,
  //         label: "1st",
  //         spacing: 2,
  //         labelWidth: 30,
  //         labelTextStyle: { color: "gray" },
  //         frontColor: "#016738",
  //       },
  //       {
  //         value: eventFeedbackData.length,
  //         // label: "Total Feedback",
  //         // spacing: 2,
  //         // labelWidth: 100,
  //         // labelTextStyle: { color: "gray" },
  //         frontColor: "#FEA13D",
  //       },
  //     ];

  //     setBarData(newBarData);
  //   }
  // }, [eventFeedbackData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderTitle = () => {
    return (
      <View style={{ marginVertical: 30 }}>
        <Text
          style={{
            // color: "white",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Event Chart
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 24,
            // backgroundColor: "yellow",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "#016738",
                marginRight: 8,
              }}
            />
            <Text
              style={{
                width: 60,
                height: 16,
                // color: "lightgray",
              }}
            >
              Event
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: "#FEA13D",
                marginRight: 8,
              }}
            />
            <Text
              style={{
                width: 70,
                height: 16,
                // color: "lightgray",
              }}
            >
              Feedback
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <View className="flex-1 flex-row justify-between items-center mt-10">
              <Text className="text-2xl px-4  text-semibold text-secondary font-psemibold">
                Reports
              </Text>
            </View>

            <View>
              <View className="flex-1 justify-center px-2 mt-5">
                {/* <Text
                  className="align-center"
                  style={{
                    // textAlign: "center",
                    fontSize: 18,
                    marginBottom: 20,
                  }}
                >
                  Monthly Comparison
                </Text> */}

                <View
                  style={{
                    backgroundColor: "#F3F5AD",
                    paddingBottom: 40,
                    borderRadius: 10,
                  }}
                >
                  {renderTitle()}
                  <BarChart
                    data={barData}
                    barWidth={8}
                    spacing={24}
                    roundedTop
                    roundedBottom
                    hideRules
                    xAxisThickness={0}
                    yAxisThickness={0}
                    // yAxisTextStyle={{ color: "gray" }}
                    noOfSections={3}
                    maxValue={20}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Reports;
