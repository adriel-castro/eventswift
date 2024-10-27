import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment-timezone";

const DatePickerField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  showDatePicker,
  toggleDatePicker,
  ...props
}) => {
  const isDateField = title === "Event Date" || title === "Birth Date";
  const formattedDate = value
    ? moment(value).tz("Asia/Manila").format("YYYY-MM-DD")
    : "Select a date";

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="border-2 border-black-500 w-full h-16 px-4 rounded-2xl focus:border-secondary items-center flex-row">
        {isDateField && (
          <TouchableOpacity onPress={toggleDatePicker}>
            <Text className="text-[#7b7b8b] text-base font-psemibold">
              {formattedDate}
            </Text>
          </TouchableOpacity>
        )}

        {showDatePicker && isDateField && (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="default"
            onChange={handleChangeText}
            // maximumDate={new Date()}
          />
        )}
      </View>
    </View>
  );
};

export default DatePickerField;
