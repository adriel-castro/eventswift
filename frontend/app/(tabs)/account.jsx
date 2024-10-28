import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { icons } from "../../constants";
import { getEvents, updateUser } from "../../lib/db";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox";
import useRefresh from "../../lib/useRefresh";
import Icon from "react-native-vector-icons/FontAwesome5";
import FormField from "../../components/FormField";
import DatePickerField from "../../components/DatePickerField";
import DropdownField from "../../components/DropdownField";
import moment from "moment";
import CustomButton from "../../components/CustomButton";
import Loader from "../../components/reusables/Loader";

const Account = () => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    logout,
    accessToken,
    departments: deptItems,
  } = useGlobalContext();
  const { data: eventsData } = useRefresh(() => getEvents(accessToken));
  const [showEditAccount, setShowEditAccount] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [showBirthDate, setShowBirthDate] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [openDepartment, setOpenDepartment] = useState(false);
  const [departmentItems, setDepartmentItems] = useState(deptItems);
  const [accountUpdate, setAccountUpdate] = useState([]);

  const handleShowEditModal = (data) => {
    setAccountData(data);
    setShowEditAccount(true);
  };

  const handleChange = (field, value) => {
    setAccountUpdate({ ...accountUpdate, [field]: value });
  };

  const handleDateChange = (field, selectedDate) => {
    setShowBirthDate(false);
    setDateOfBirth(selectedDate);
  };

  useEffect(() => {
    if (dateOfBirth) {
      setAccountUpdate({
        ...accountUpdate,
        birthDate: moment(dateOfBirth).format("YYYY-MM-DD"),
      });
    }
  }, [dateOfBirth]);

  useEffect(() => {
    if (accountData) {
      const newObj = {
        email: accountData.email,
        studentID: accountData.studentID,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        birthDate: moment(accountData.birthDate).format("YYYY-MM-DD"),
        address: accountData.address ?? "",
        department: accountData.department,
        year: accountData.year,
        role: accountData.role,
      };
      setAccountUpdate(newObj);
      setDateOfBirth(new Date(accountData.birthDate));
    }
  }, [accountData]);

  const requiredField = (user) => {
    if (user.email === "") {
      return Alert.alert("Error", "Email is required");
    } else if (user.studentID === "") {
      return Alert.alert("Error", "StudentID is required");
    } else if (user.firstName === "") {
      return Alert.alert("Error", "Firstname is required");
    } else if (user.lastName === "") {
      return Alert.alert("Error", "Lastname is required");
    }
  };

  const editUserBtn = async () => {
    requiredField(accountUpdate);

    setIsLoading(true);
    try {
      const res = await updateUser(accountData._id, accountUpdate, accessToken);

      if (res.data) {
        setUser(res.data);

        Alert.alert("Success", "You successfully updated your profile!");
        setAccountUpdate([]);
        setShowEditAccount(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <SafeAreaView className="bg-primary h-full">
          <FlatList
            data={[{ key: "account" }]}
            ListHeaderComponent={() => (
              <View className="w-full flex mt-6 mb-12 px-4">
                <View className="flex flex-row justify-end gap-4">
                  <TouchableOpacity onPress={() => handleShowEditModal(user)}>
                    <Icon name="user-edit" size={20} color="#FEA13D" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={logout}>
                    <Image
                      source={icons.logout}
                      resizeMode="contain"
                      className="w-6 h-6"
                    />
                  </TouchableOpacity>
                </View>

                <View className="w-full flex items-center justify-center mt-6">
                  <View className="w-16 h-16 border border-secondary rounded-lg flex items-center justify-center">
                    <Image
                      source={{
                        uri:
                          user?.avatar ||
                          "https://png.pngtree.com/png-clipart/20200224/original/pngtree-cartoon-color-simple-male-avatar-png-image_5230557.jpg",
                      }}
                      className="w-[90%] h-[90%] rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                  <InfoBox
                    title={
                      user?.firstName.charAt(0).toUpperCase() +
                      user?.firstName.slice(1) +
                      " " +
                      user?.lastName.charAt(0).toUpperCase() +
                      user?.lastName.slice(1)
                    }
                    containerStyles="mt-5 text-center"
                    titleStyles="text-lg"
                  />
                  <View className="mt-5 flex flex-row">
                    <InfoBox
                      title={eventsData.length || 0}
                      subtitle="Events"
                      titleStyles="text-xl"
                      containerStyles="mr-10"
                    />
                    <InfoBox
                      title="6"
                      subtitle="Attended"
                      titleStyles="text-xl"
                    />
                  </View>
                </View>

                {/* Manage User */}
                <TouchableOpacity
                  className="flex flex-row mt-10 items-center justify-between w-full p-5 border border-gray-200 rounded-xl"
                  onPress={() => router.push("/users")}
                >
                  <Text>Manage Users</Text>
                  <Icon name="users" size={20} color="#FEA13D" />
                </TouchableOpacity>

                {/* Manage User */}
                <TouchableOpacity
                  className="flex flex-row items-center justify-between w-full p-5 border border-gray-200 rounded-xl"
                  onPress={() => router.push("/departments")}
                >
                  <Text>Manage Departments</Text>
                  <Icon name="building" size={20} color="#FEA13D" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.key}
          />
        </SafeAreaView>
      )}

      {/* Edit User */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditAccount}
        onRequestClose={() => setShowEditAccount(false)}
      >
        <SafeAreaView className="bg-primary h-full mb-10">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={[{ key: "user" }]}
              renderItem={() => (
                <View className="w-full justify-center px-4 my-10">
                  <Text className="text-2xl text-secondary-200 font-psemibold">
                    Update Account
                  </Text>

                  <FormField
                    title="Email"
                    value={accountUpdate.email}
                    placeholder="Enter your Email"
                    handleChangeText={(e) => handleChange("email", e)}
                    otherStyles="mt-7"
                    keyboardType="email-address"
                  />

                  <FormField
                    title="Student ID"
                    value={accountUpdate.studentID}
                    placeholder="Enter your ID Number"
                    handleChangeText={(e) => handleChange("studentID", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="First Name"
                    value={accountUpdate.firstName}
                    placeholder="Enter your First Name"
                    handleChangeText={(e) => handleChange("firstName", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Last Name"
                    value={accountUpdate.lastName}
                    placeholder="Enter your Last Name"
                    handleChangeText={(e) => handleChange("lastName", e)}
                    otherStyles="mt-5"
                  />

                  <DatePickerField
                    title="Birth Date"
                    value={dateOfBirth}
                    handleChangeText={handleDateChange}
                    otherStyles="mt-5"
                    showDatePicker={showBirthDate}
                    toggleDatePicker={() => setShowBirthDate(true)}
                  />

                  <DropdownField
                    title="Department"
                    value={accountUpdate.department}
                    placeholder="Select Department"
                    handleChange={(e) => handleChange("department", e)}
                    otherStyles="mt-5"
                    open={openDepartment}
                    setOpen={setOpenDepartment}
                    items={departmentItems}
                    setItems={setDepartmentItems}
                  />

                  <FormField
                    title="Address"
                    value={accountUpdate.address}
                    placeholder="Enter your Address"
                    handleChangeText={(e) => handleChange("address", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Year"
                    value={accountUpdate.year}
                    placeholder="Enter Year Level"
                    handleChangeText={(e) => handleChange("year", e)}
                    otherStyles="mt-5"
                  />

                  <CustomButton
                    title="Update Account"
                    handlePress={editUserBtn}
                    containerStyles="mt-14"
                  />

                  <CustomButton
                    title="Cancel"
                    handlePress={() => setShowEditAccount(false)}
                    containerStyles="mt-5"
                  />
                </View>
              )}
              keyExtractor={(item) => item.key}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Account;
