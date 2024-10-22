import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  // showDatePicker,
  // toggleDatePicker, // This function triggers the date picker for birth date
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isDateField = title === "Birth Date";
  const isIDNumberField = title === "Student ID";
  const yearField = title === "Year";

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      {/* bg-black-100 */}
      <View className="border-2 border-black-500 w-full h-16 px-4 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 font-psemibold text-base"
          value={isDateField ? value.toDateString() : value} // Display formatted date for Birth Date
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={
            title === "Password" || title === "Confirm Password"
              ? !showPassword
              : undefined
          }
          editable={!isDateField} // Disable direct editing for Birth Date
          // onPressIn={isDateField ? toggleDatePicker : undefined} // Show date picker when tapping Birth Date field
          keyboardType={isIDNumberField || yearField ? "numeric" : undefined}
          maxLength={isIDNumberField ? 12 : yearField ? 1 : undefined}
          // {...props}
        />

        {title === "Password" || title === "Confirm Password" ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}

        {/* {isDateField && (
          <TouchableOpacity onPress={toggleDatePicker}>
            <Text>{value.toDateString()}</Text>
          </TouchableOpacity>
        )} */}

        {/* {showDatePicker && isDateField && (
          <DateTimePicker
            value={value}
            mode="date"
            display="default"
            onChange={handleChangeText}
            maximumDate={new Date()}
          />
        )} */}
      </View>
    </View>
  );
};

export default FormField;
