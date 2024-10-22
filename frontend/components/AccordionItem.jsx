import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

// Helper function to format the date to 'YYYY-MM-DD'
const formatDate = (date) => new Date(date).toISOString().split("T")[0];

// Accordion for displaying event details
const EventAccordion = ({ event, isOpen, onToggle }) => (
  <View>
    <TouchableOpacity
      className="flex flex-row items-center justify-between w-full p-3 border border-gray-200 rounded-lg"
      onPress={onToggle}
    >
      <Text>{event.name}</Text>
      <Icon
        name="caret-down"
        size={15}
        color="gray"
        style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
      />
    </TouchableOpacity>

    {isOpen && (
      <View className="p-3 border-secondary border-2">
        <Text>Date: {formatDate(event.eventDate)}</Text>
        <Text>
          Time: {event.startTime} - {event.endTime}
        </Text>
        <Text>Location: {event.location}</Text>
        <Text>Description: {event.description}</Text>
        <Text>Organizer: {event.organizer.name}</Text>
        <Text>Contact Info: {event.organizer.contact || "N/A"}</Text>
        <Text>Mandatory: {event.isMandatory ? "Yes" : "No"}</Text>
        <Text>Status: {event.status}</Text>

        <CustomButton
          title="Generate QR"
          handlePress={() =>
            router.push({ pathname: "/qrcode", params: { eventId: event._id } })
          }
          containerStyles="mt-5"
        />
        <CustomButton
          title="Check In"
          handlePress={() => router.push("/checkin")}
          containerStyles="mt-5"
        />
      </View>
    )}
  </View>
);

// Accordion for displaying department and its events
const DepartmentAccordion = ({ department, events }) => {
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [openEventIndex, setOpenEventIndex] = useState(null);

  const toggleEvent = (index) => {
    setOpenEventIndex(openEventIndex === index ? null : index);
  };

  return (
    <View>
      <TouchableOpacity
        className="flex flex-row items-center justify-between w-full p-5 border border-gray-200 rounded-xl"
        onPress={() => setIsDepartmentOpen(!isDepartmentOpen)}
      >
        <Text>{department}</Text>
        <Icon
          name="caret-down"
          size={15}
          color="gray"
          style={{
            transform: [{ rotate: isDepartmentOpen ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      {isDepartmentOpen &&
        events.map((event, index) => (
          <EventAccordion
            key={index}
            event={event}
            isOpen={openEventIndex === index}
            onToggle={() => toggleEvent(index)}
          />
        ))}
    </View>
  );
};

// Group events by department
const groupByDepartment = (events) => {
  return events.reduce((acc, event) => {
    if (!acc[event.department]) {
      acc[event.department] = [];
    }
    acc[event.department].push(event);
    return acc;
  }, {});
};

// Main component for today's and upcoming events
const AccordionItem = ({ eventsData }) => {
  const today = formatDate(new Date());
  const todaysEvents = eventsData.filter(
    (event) => formatDate(event.eventDate) === today
  );
  const upcomingEvents = eventsData.filter(
    (event) => formatDate(event.eventDate) > today
  );

  const groupedTodaysEvents = groupByDepartment(todaysEvents);
  const groupedUpcomingEvents = groupByDepartment(upcomingEvents);

  return (
    <View className="mb-4">
      {/* Today's Events Section */}
      {todaysEvents.length > 0 && (
        <>
          <Text className="text-xl mt-5 text-semibold text-secondary font-psemibold">
            Today's Events
          </Text>
          {Object.keys(groupedTodaysEvents).map((department, index) => (
            <DepartmentAccordion
              key={index}
              department={department}
              events={groupedTodaysEvents[department]}
            />
          ))}
        </>
      )}

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <>
          <Text className="text-xl mt-5 text-semibold text-secondary font-psemibold">
            Upcoming Events
          </Text>
          {Object.keys(groupedUpcomingEvents).map((department, index) => (
            <DepartmentAccordion
              key={index}
              department={department}
              events={groupedUpcomingEvents[department]}
            />
          ))}
        </>
      )}
    </View>
  );
};

export default AccordionItem;
