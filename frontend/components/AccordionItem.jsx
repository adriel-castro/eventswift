import { View, Text } from "react-native";
import React from "react";
import moment from "moment";
import DepartmentAccordion from "./DepartmentAccordion";
import { useSegments } from "expo-router";

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
const AccordionItem = ({ eventsData, refetch }) => {
  const segments = useSegments();
  const pathname = `/${segments.join("/")}`;
  const today = moment().format("YYYY-MM-DD");
  const currentTime = moment();
  // Today's events: Events happening today and not yet ended
  const todaysEvents = eventsData
    .filter((event) => {
      const eventDate = moment(event.eventDate).format("YYYY-MM-DD");
      const endTime = moment(
        `${eventDate} ${event.endTime}`,
        "YYYY-MM-DD h:mm A"
      );

      return eventDate === today && currentTime.isBefore(endTime);
    })
    .sort((a, b) => {
      const dateComparison = moment(a.eventDate).diff(moment(b.eventDate));
      if (dateComparison !== 0) return dateComparison;

      const timeComparison = moment(a.startTime, "h:mm A").diff(
        moment(b.startTime, "h:mm A")
      );
      if (timeComparison !== 0) return timeComparison;

      return a.department.localeCompare(b.department);
    });

  // Upcoming events: Events in the future, sorted by date, time, and department
  const upcomingEvents = eventsData
    .filter((event) => moment(event.eventDate).isAfter(today))
    .sort((a, b) => {
      const dateComparison = moment(a.eventDate).diff(moment(b.eventDate));
      if (dateComparison !== 0) return dateComparison;

      const timeComparison = moment(a.startTime, "h:mm A").diff(
        moment(b.startTime, "h:mm A")
      );
      if (timeComparison !== 0) return timeComparison;

      return a.department.localeCompare(b.department);
    });

  // Past events: Events that have already ended, sorted by descending date, descending time, and ascending department
  const pastEvents = eventsData
    .filter((event) => {
      const eventDate = moment(event.eventDate).format("YYYY-MM-DD");
      const endTime = moment(
        `${eventDate} ${event.endTime}`,
        "YYYY-MM-DD h:mm A"
      );

      return (
        eventDate < today ||
        (eventDate === today && currentTime.isAfter(endTime))
      );
    })
    .sort((a, b) => {
      const dateComparison = moment(b.eventDate).diff(moment(a.eventDate)); // Descending by date
      if (dateComparison !== 0) return dateComparison;

      const timeComparison = moment(b.startTime, "h:mm A").diff(
        moment(a.startTime, "h:mm A")
      ); // Descending by time
      if (timeComparison !== 0) return timeComparison;

      return a.department.localeCompare(b.department); // Ascending by department
    });

  const groupedTodaysEvents = groupByDepartment(todaysEvents);
  const groupedUpcomingEvents = groupByDepartment(upcomingEvents);
  const groupedPastEvents = groupByDepartment(pastEvents);

  return (
    <View className="mb-4">
      {/* Today's Events Section */}
      <Text className="text-xl mt-5 text-semibold text-secondary font-psemibold">
        Today's Events {todaysEvents.length > 0 ? todaysEvents.length : null}
      </Text>
      {todaysEvents && todaysEvents.length > 0 ? (
        <>
          {Object.keys(groupedTodaysEvents).map((department, index) => (
            <DepartmentAccordion
              key={index}
              department={department}
              events={groupedTodaysEvents[department]}
              refetch={refetch}
            />
          ))}
        </>
      ) : (
        <Text className="text-lg p-2">No events today.</Text>
      )}

      {pathname === "/(tabs)/home" ? null : (
        <>
          {/* Upcoming Events Section */}
          <Text className="text-xl mt-5 text-semibold text-secondary font-psemibold">
            Upcoming Events ({upcomingEvents.length})
          </Text>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <>
              {Object.keys(groupedUpcomingEvents).map((department, index) => (
                <DepartmentAccordion
                  key={index}
                  department={department}
                  events={groupedUpcomingEvents[department]}
                  refetch={refetch}
                />
              ))}
            </>
          ) : (
            <Text className="text-lg p-2">No upcoming events.</Text>
          )}

          {/* Past Events Section */}
          <Text className="text-xl mt-5 text-semibold text-secondary font-psemibold">
            Past Events ({pastEvents.length})
          </Text>
          {pastEvents && pastEvents.length > 0 ? (
            <>
              {Object.keys(groupedPastEvents).map((department, index) => (
                <DepartmentAccordion
                  key={index}
                  department={department}
                  events={groupedPastEvents[department]}
                  refetch={refetch}
                />
              ))}
            </>
          ) : (
            <Text className="text-lg p-2">No upcoming events.</Text>
          )}
        </>
      )}
    </View>
  );
};

export default AccordionItem;
