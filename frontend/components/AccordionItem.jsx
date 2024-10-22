import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

import CustomButton from "./CustomButton";
import { router } from "expo-router";

// Helper function to format the date to 'YYYY-MM-DD'
const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

const AccordionItem = ({ department, items }) => {
  const [isOpen, setIsOpen] = useState(false); // State for department accordion
  const [openEventIndex, setOpenEventIndex] = useState(null); // State for individual event accordion

  const toggleDepartment = () => {
    if (isOpen) {
      setOpenEventIndex(null); // Close all inner event accordions
    }
    setIsOpen(!isOpen); // Toggle department accordion
  };

  const toggleEvent = (index) => {
    setOpenEventIndex(openEventIndex === index ? null : index); // Toggle individual event accordion
  };

  // Get today's date in 'YYYY-MM-DD' format
  const today = formatDate(new Date());

  // Categorize events into today's and upcoming events
  const todaysEvents = items.filter((event) => event.date === today);
  const upcomingEvents = items.filter((event) => event.date > today);

  return (
    <View className="mb-4">
      {/* First-level accordion for departments */}
      <TouchableOpacity
        className="flex flex-row items-center justify-between w-full p-5 font-psemibold text-gray-100 border border-gray-200 rounded-xl"
        onPress={toggleDepartment} // Toggle department accordion
      >
        <Text>{department}</Text>
        <View className={`transform ${isOpen ? "rotate-180" : ""}`}>
          <Icon name="caret-down" size={15} color="gray" />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View className="px-2">
          {/* Second-level accordion for today's events */}
          {todaysEvents.length > 0 && (
            <View>
              <Text className="text-xl mt-5 text-semibold text-secondary font-psemibold">
                Today's Events
              </Text>
              {todaysEvents.map((event, index) => (
                <View key={index}>
                  {/* Event Name Accordion */}
                  <TouchableOpacity
                    className="flex flex-row items-center justify-between w-full p-3 font-psemibold text-gray-100 border border-gray-200 rounded-lg"
                    onPress={() => toggleEvent(index)} // Toggle individual event accordion
                  >
                    <Text>{event.eventName}</Text>
                    <View
                      className={`transform ${
                        openEventIndex === index ? "rotate-180" : ""
                      }`}
                    >
                      <Icon name="caret-down" size={15} color="gray" />
                    </View>
                  </TouchableOpacity>

                  {/* Event Details */}
                  {openEventIndex === index && (
                    <View className="p-3 border-secondary border-2">
                      <Text>Date: {event.date}</Text>
                      <Text>Time: {event.time}</Text>
                      <Text>Location: {event.location}</Text>
                      <Text>Description: {event.description}</Text>
                      <Text>Organizer: {event.organizer.name}</Text>
                      <Text>
                        Contact Info: {event.organizer.contactInfo || "N/A"}
                      </Text>
                      <Text>Mandatory: {event.mandatory ? "Yes" : "No"}</Text>
                      <Text>
                        Status:{" "}
                        {event.eventStatus.charAt(0).toUpperCase() +
                          event.eventStatus.slice(1)}
                      </Text>

                      <CustomButton
                        title="Check In"
                        handlePress={() => router.push("/scanner")}
                        containerStyles="mt-5"
                        // isLoading={isSubmitting}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Second-level accordion for upcoming events */}
          {upcomingEvents.length > 0 && (
            <View>
              <Text className="text-xl mt-5 text-semibold text-secondary font-psemibold">
                Upcoming Events
              </Text>
              {upcomingEvents.map((event, index) => (
                <View key={index}>
                  {/* Event Name Accordion */}
                  <TouchableOpacity
                    className="flex flex-row items-center justify-between w-full p-3 font-psemibold text-gray-100 border border-gray-200 rounded-lg"
                    onPress={() => toggleEvent(index + todaysEvents.length)} // Toggle individual event accordion
                  >
                    <Text>{event.eventName}</Text>
                    <View
                      className={`transform ${
                        openEventIndex === index + todaysEvents.length
                          ? "rotate-180"
                          : ""
                      }`}
                    >
                      <Icon name="caret-down" size={15} color="gray" />
                    </View>
                  </TouchableOpacity>

                  {/* Event Details */}
                  {openEventIndex === index + todaysEvents.length && (
                    <View className="p-3 border-secondary border-2">
                      <Text>Date: {event.date}</Text>
                      <Text>Time: {event.time}</Text>
                      <Text>Location: {event.location}</Text>
                      <Text>Description: {event.description}</Text>
                      <Text>Organizer: {event.organizer.name}</Text>
                      <Text>
                        Contact Info: {event.organizer.contactInfo || "N/A"}
                      </Text>
                      <Text>Mandatory: {event.mandatory ? "Yes" : "No"}</Text>
                      <Text>
                        Status:{" "}
                        {event.eventStatus.charAt(0).toUpperCase() +
                          event.eventStatus.slice(1)}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default AccordionItem;
