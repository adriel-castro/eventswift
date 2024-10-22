// Accordion.js
import React from "react";
import { View, Text } from "react-native";
import AccordionItem from "./AccordionItem";

const Accordion = ({ items }) => {
  // const sortedItems = items.sort((a, b) => {
  //   if (a.department < b.department) return -1;
  //   if (a.department > b.department) return 1;
  //   return 0;
  // });

  return (
    <View className="p-4">
      {items &&
        items.length > 0 &&
        items.map((item, index) => (
          <AccordionItem
            key={index}
            department={item.department}
            items={item.events} // Pass the events for each department
          />
        ))}
    </View>
  );
};

export default Accordion;
