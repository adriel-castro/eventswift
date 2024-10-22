import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from "../../components/Accordion";

import { eventsData } from "../../lib/data";

const Home = () => {
  // const items = [
  //   {
  //     title: "CECT",
  //     date: "2024-10-15",
  //     content: (
  //       <>
  //         <Text className="mb-2 text-gray-500">
  //           Flowbite is an open-source library of interactive components built
  //           on top of Tailwind CSS including buttons, dropdowns, modals,
  //           navbars, and more.
  //         </Text>
  //         <Text className="text-gray-500">
  //           Check out this guide to learn how to{" "}
  //           <Text className="text-blue-600">get started</Text> and start
  //           developing websites even faster with components on top of Tailwind
  //           CSS.
  //         </Text>
  //       </>
  //     ),
  //   },
  //   {
  //     title: "CHTM",
  //     content: (
  //       <>
  //         <Text className="mb-2 text-gray-500">
  //           Flowbite is first conceptualized and designed using the Figma
  //           software so everything you see in the library has a design
  //           equivalent in our Figma file.
  //         </Text>
  //         <Text className="text-gray-500">
  //           Check out the{" "}
  //           <Text className="text-blue-600">Figma design system</Text> based on
  //           the utility classes from Tailwind CSS and components from Flowbite.
  //         </Text>
  //       </>
  //     ),
  //   },
  //   {
  //     title: "CBA",
  //     content: (
  //       <>
  //         <Text className="mb-2 text-gray-500">
  //           The main difference is that the core components from Flowbite are
  //           open source under the MIT license, whereas Tailwind UI is a paid
  //           product.
  //         </Text>
  //         <Text className="mb-2 text-gray-500">
  //           Learn more about these technologies:
  //         </Text>
  //         <Text className="text-gray-500 list-disc pl-5">
  //           <Text className="text-blue-600">Flowbite Pro</Text>
  //           {"\n"}
  //           <Text className="text-blue-600">Tailwind UI</Text>
  //         </Text>
  //       </>
  //     ),
  //   },
  // ];

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <Text className="text-2xl px-4 mt-10 text-semibold text-secondary font-psemibold">
          Events
        </Text>
        <Accordion items={eventsData} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
