import { View, Text } from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

import { icons } from "../constants";

const DropdownField = ({
  title,
  value,
  placeholder,
  handleChange,
  otherStyles,
  open,
  setOpen,
  items,
  setItems,
  ...props
}) => {
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View>
        <DropDownPicker
          className="border-2 border-black-500 w-full h-16 px-4 rounded-2xl focus:border-secondary items-center flex-row z-auto"
          value={value}
          open={open}
          setOpen={setOpen}
          items={items}
          setItems={setItems}
          placeholder={placeholder}
          setValue={(callback) => {
            const selectedValue = callback();
            handleChange(selectedValue);
          }}
          zIndex={1000}
          textStyle={{
            fontFamily: "Poppins-SemiBold",
            fontSize: 16,
            color: "#7b7b8b",
          }}
        />
      </View>
    </View>
  );
};

export default DropdownField;
