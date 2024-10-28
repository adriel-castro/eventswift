import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Modal,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteUser, getUsers, signUpUser, updateUser } from "../../lib/db";
import { useGlobalContext } from "../../context/GlobalProvider";
import useRefresh from "../../lib/useRefresh";
import Icon from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import DropdownField from "../../components/DropdownField";
import { icons } from "../../constants";
import DatePickerField from "../../components/DatePickerField";

const Users = () => {
  const { accessToken, departments: deptItems } = useGlobalContext();
  const {
    data: allUserData,
    setLoading: setIsUserLoading,
    refetch,
  } = useRefresh(() => getUsers(accessToken));
  const [refreshing, setRefreshing] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showBirthDate, setShowBirthDate] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const [userData, setUserData] = useState(null);
  const [openEventIndex, setOpenEventIndex] = useState(null);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [departmentItems, setDepartmentItems] = useState(deptItems);
  const [openRole, setOpenRole] = useState(false);
  const [roleItems, setRoleItems] = useState([
    {
      value: "user",
      label: "User",
    },
    {
      value: "admin",
      label: "Admin",
    },
    {
      value: "facilitator",
      label: "Facilitator",
    },
  ]);
  const [createUser, setCreateUser] = useState({
    email: "",
    studentID: "",
    password: "TempPassword!",
    firstName: "",
    lastName: "",
    birthDate: "",
    address: "",
    department: "",
    year: "",
    role: "user",
  });
  const [editUser, setEditUser] = useState([]);

  const toggleEvent = (index) => {
    setOpenEventIndex(openEventIndex === index ? null : index);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const sortedUserData = allUserData?.sort((a, b) => {
    if (a.firstName < b.firstName) return -1;
    if (a.firstName > b.firstName) return 1;
    if (a.lastName < b.lastName) return -1;
    if (a.lastName > b.lastName) return 1;
    return 0;
  });

  const handleShowEditModal = (user) => {
    setUserData(user);
    setShowEditUser(true);
  };

  const handleShowDeleteModal = (user) => {
    setUserData(user);
    setShowDeleteUser(true);
  };

  const handleChange = (field, value) => {
    setCreateUser({ ...createUser, [field]: value });
  };

  const handleEditChange = (field, value) => {
    setEditUser({ ...editUser, [field]: value });
  };

  const handleDateChange = (field, selectedDate) => {
    setShowBirthDate(false);
    setDateOfBirth(selectedDate);
  };

  const handleDateEditChange = (field, selectedDate) => {
    setShowBirthDate(false);
    setEditDateOfBirth(selectedDate);
  };

  useEffect(() => {
    if (dateOfBirth) {
      setCreateUser({
        ...createUser,
        birthDate: moment(dateOfBirth).format("YYYY-MM-DD"),
      });
    }
  }, [dateOfBirth]);

  useEffect(() => {
    if (editDateOfBirth) {
      setEditUser({
        ...editUser,
        birthDate: moment(editDateOfBirth).format("YYYY-MM-DD"),
      });
    }
  }, [editDateOfBirth]);

  useEffect(() => {
    if (userData !== null) {
      const newObj = {
        email: userData.email,
        studentID: userData.studentID,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: moment(userData.birthDate).format("YYYY-MM-DD"),
        address: userData.address,
        department: userData.department,
        year: userData.year,
        role: userData.role,
      };
      setEditUser(newObj);
      setEditDateOfBirth(new Date(userData.birthDate));
    }
  }, [userData]);

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

  const addUserBtn = async () => {
    requiredField(createUser);

    setIsUserLoading(true);
    try {
      const res = await signUpUser(createUser);

      if (res.data) {
        await refetch();

        Alert.alert("Success", "You successfully created a new user!");
        setCreateUser({
          email: "",
          studentID: "",
          password: "TempPassword!",
          firstName: "",
          lastName: "",
          birthDate: "",
          address: "",
          department: "",
          year: "",
          role: "user",
        });
        setShowAddUser(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsUserLoading(false);
    }
  };

  const editUserBtn = async () => {
    requiredField(editUser);

    setIsUserLoading(true);
    try {
      const res = await updateUser(userData._id, editUser, accessToken);

      if (res.data) {
        await refetch();

        Alert.alert("Success", "You successfully updated a user!");
        setCreateUser([]);
        setShowEditUser(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsUserLoading(false);
    }
  };

  const deleteUserBtn = async () => {
    setIsUserLoading(true);
    try {
      const res = await deleteUser(userData?._id, accessToken);

      if (res.data) {
        await refetch();

        Alert.alert("Success", "You successfully deleted a user!");
        setUserData(null);
        setShowDeleteUser(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsUserLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView className="bg-primary h-full">
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <View className="flex-1 flex-row justify-between items-center mt-10">
              <Text className="text-2xl px-4  text-semibold text-secondary font-psemibold">
                Manage Users
              </Text>
              <TouchableOpacity
                className="px-4 flex flex-row"
                onPress={() => setShowAddUser(true)}
              >
                <Image
                  source={icons.plus}
                  resizeMode="contain"
                  tintColor="#FEA13D"
                  className="w-8 h-8"
                />
              </TouchableOpacity>
            </View>

            {sortedUserData && sortedUserData.length <= 0 ? null : (
              <>
                {sortedUserData.map((user, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      className="flex flex-row items-center justify-between w-full border-b-2 border-gray-200 mt-5 py-3 px-5"
                      onPress={() => toggleEvent(index)}
                    >
                      <Text>
                        {user.firstName.charAt(0).toUpperCase() +
                          user.firstName.slice(1) +
                          " " +
                          user.lastName.charAt(0).toUpperCase() +
                          user.lastName.slice(1)}
                      </Text>
                      <View className="flex flex-row gap-3">
                        <View className="flex flex-row mr-2">
                          <TouchableOpacity
                            className="mr-3"
                            onPress={() => handleShowEditModal(user)}
                          >
                            <Icon name="edit" size={20} color="#FEA13D" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleShowDeleteModal(user)}
                          >
                            <Icon name="trash-alt" size={20} color="red" />
                          </TouchableOpacity>
                        </View>
                        <Icon
                          name="caret-down"
                          size={15}
                          color="gray"
                          style={{
                            transform: [
                              {
                                rotate:
                                  openEventIndex === index ? "180deg" : "0deg",
                              },
                            ],
                          }}
                        />
                      </View>
                    </TouchableOpacity>

                    {openEventIndex === index && (
                      <View className="mx-2 p-3 border-secondary border-2">
                        <Text>Email: {user.email}</Text>
                        <Text>Student ID: {user.studentID}</Text>
                        <Text>
                          BirthDate: {moment(user.birthdate).format("LL")}
                        </Text>
                        {user.address ? (
                          <Text>Address: {user.address}</Text>
                        ) : null}
                        <Text>Department: {user.department}</Text>
                        <Text>Year: {user.year}</Text>
                        <Text>Role: {user.role}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Add User */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddUser}
        onRequestClose={() => setShowAddUser(false)}
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
                    Add New User
                  </Text>
                  <FormField
                    title="Email"
                    value={createUser.email}
                    placeholder="Enter your Email"
                    handleChangeText={(e) => handleChange("email", e)}
                    otherStyles="mt-7"
                    keyboardType="email-address"
                  />
                  <FormField
                    title="Student ID"
                    value={createUser.studentID}
                    placeholder="Enter your ID Number"
                    handleChangeText={(e) => handleChange("studentID", e)}
                    otherStyles="mt-5"
                  />
                  <FormField
                    title="First Name"
                    value={createUser.firstName}
                    placeholder="Enter your First Name"
                    handleChangeText={(e) => handleChange("firstName", e)}
                    otherStyles="mt-5"
                  />
                  <FormField
                    title="Last Name"
                    value={createUser.lastName}
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
                    value={createUser.department}
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
                    value={createUser.address}
                    placeholder="Enter your Address"
                    handleChangeText={(e) => handleChange("address", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Year"
                    value={createUser.year}
                    placeholder="Enter Year Level"
                    handleChangeText={(e) => handleChange("year", e)}
                    otherStyles="mt-5"
                  />
                  <DropdownField
                    title="Role"
                    value={createUser.role}
                    placeholder="Select Role"
                    handleChange={(e) => handleChange("role", e)}
                    otherStyles="mt-5"
                    open={openRole}
                    setOpen={setOpenRole}
                    items={roleItems}
                    setItems={setRoleItems}
                  />
                  <CustomButton
                    title="Create"
                    handlePress={addUserBtn}
                    containerStyles="mt-14"
                  />
                  <CustomButton
                    title="Cancel"
                    handlePress={() => setShowAddUser(false)}
                    containerStyles="mt-5"
                  />
                </View>
              )}
              keyExtractor={(item) => item.key}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Edit User */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEditUser}
        onRequestClose={() => setShowEditUser(false)}
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
                    Edit User
                  </Text>
                  <FormField
                    title="Email"
                    value={editUser.email}
                    placeholder="Enter your Email"
                    handleChangeText={(e) => handleEditChange("email", e)}
                    otherStyles="mt-7"
                    keyboardType="email-address"
                  />
                  <FormField
                    title="Student ID"
                    value={editUser.studentID}
                    placeholder="Enter your ID Number"
                    handleChangeText={(e) => handleEditChange("studentID", e)}
                    otherStyles="mt-5"
                  />
                  <FormField
                    title="First Name"
                    value={editUser.firstName}
                    placeholder="Enter your First Name"
                    handleChangeText={(e) => handleEditChange("firstName", e)}
                    otherStyles="mt-5"
                  />
                  <FormField
                    title="Last Name"
                    value={editUser.lastName}
                    placeholder="Enter your Last Name"
                    handleChangeText={(e) => handleEditChange("lastName", e)}
                    otherStyles="mt-5"
                  />
                  <DatePickerField
                    title="Birth Date"
                    value={editDateOfBirth}
                    handleChangeText={handleDateEditChange}
                    otherStyles="mt-5"
                    showDatePicker={showBirthDate}
                    toggleDatePicker={() => setShowBirthDate(true)}
                  />

                  <DropdownField
                    title="Department"
                    value={editUser.department}
                    placeholder="Select Department"
                    handleChange={(e) => handleEditChange("department", e)}
                    otherStyles="mt-5"
                    open={openDepartment}
                    setOpen={setOpenDepartment}
                    items={departmentItems}
                    setItems={setDepartmentItems}
                  />

                  <FormField
                    title="Address"
                    value={editUser.address}
                    placeholder="Enter your Address"
                    handleChangeText={(e) => handleEditChange("address", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Year"
                    value={editUser.year}
                    placeholder="Enter Year Level"
                    handleChangeText={(e) => handleEditChange("year", e)}
                    otherStyles="mt-5"
                  />
                  <DropdownField
                    title="Role"
                    value={editUser.role}
                    placeholder="Select Role"
                    handleChange={(e) => handleEditChange("role", e)}
                    otherStyles="mt-5"
                    open={openRole}
                    setOpen={setOpenRole}
                    items={roleItems}
                    setItems={setRoleItems}
                  />
                  <CustomButton
                    title="Update"
                    handlePress={editUserBtn}
                    containerStyles="mt-14"
                  />
                  <CustomButton
                    title="Cancel"
                    handlePress={() => setShowEditUser(false)}
                    containerStyles="mt-5"
                  />
                </View>
              )}
              keyExtractor={(item) => item.key}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Delete Modal */}
      <Modal
        animationType="slide" // or 'fade' for a fade effect
        transparent={true} // Makes the modal background transparent
        visible={showDeleteUser}
        onRequestClose={() => setShowDeleteUser(false)}
      >
        <SafeAreaView className="bg-primary h-full">
          <View className="w-full min-h-[85vh] justify-center px-4 my-6">
            <Text className="text-2xl text-center">
              Are you sure do you want to delete{" "}
              <Text className="font-psemibold">
                {userData?.firstName.charAt(0) +
                  userData?.firstName.slice(1) +
                  " " +
                  userData?.lastName.charAt(0) +
                  userData?.lastName.slice(1)}
              </Text>
              ?
            </Text>

            <CustomButton
              title="Delete"
              handlePress={deleteUserBtn}
              containerStyles="mt-14"
            />
            <CustomButton
              title="Cancel"
              handlePress={() => setShowDeleteUser(false)}
              containerStyles="mt-5"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default Users;
