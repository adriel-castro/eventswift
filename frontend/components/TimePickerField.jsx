import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment-timezone";

const TimePickerField = ({ title, value, handleChangeText, otherStyles }) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleTimePicker = () => {
    setShowTimePicker(!showTimePicker);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      handleChangeText(selectedTime);
    }
  };

  const formattedTime = value
    ? moment(value).format("hh:mm A") // Format the time
    : "Select a time";

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="border-2 border-black-500 w-full h-16 px-4 rounded-2xl flex-row items-center">
        <TouchableOpacity onPress={toggleTimePicker}>
          <Text className="text-[#7b7b8b] text-base font-psemibold">
            {formattedTime}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={value || new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </View>
  );
};

export default TimePickerField;
