// Accordion.js
import React from "react";
import { View } from "react-native";
import AccordionItem from "./AccordionItem";

const Accordion = ({ eventsData }) => {
  return (
    <View className="p-4">
      <AccordionItem eventsData={eventsData} />
    </View>
  );
};

export default Accordion;
