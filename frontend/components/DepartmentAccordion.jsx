import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome5";
import EventAccordion from "./EventAccordion";

const DepartmentAccordion = ({ department, events, refetch }) => {
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
        <Text>{department + " " + `(${events.length})`}</Text>
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
            refetch={refetch}
          />
        ))}
    </View>
  );
};

export default DepartmentAccordion;
