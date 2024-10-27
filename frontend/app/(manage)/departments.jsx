import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { createNewDepartment, getDepartments } from "../../lib/db";
import { useGlobalContext } from "../../context/GlobalProvider";
import useRefresh from "../../lib/useRefresh";
import Icon from "react-native-vector-icons/FontAwesome5";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const Departments = () => {
  const { accessToken } = useGlobalContext();
  const {
    data: departmentData,
    setData: setDepartmentData,
    loading: isDeptLoading,
    setLoading: setIsDeptLoading,
    refetch,
  } = useRefresh(() => getDepartments());
  const [refreshing, setRefreshing] = useState(false);
  const [showAddDept, setShowAddDept] = useState(false);
  const [showEditDept, setShowEditDept] = useState(false);
  const [showDeleteDept, setShowDeleteDept] = useState(false);
  const [dept, setDept] = useState({
    name: "",
    description: "",
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const sortedDepartment = departmentData?.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const handleChangeAdd = (field, value) => {
    setDept({
      ...dept,
      [field]: value,
    });
  };

  const addDepartmentBtn = async () => {
    if (dept.name === "") {
      return Alert.alert("Error", "Department name is required");
    }

    setIsDeptLoading(true);
    try {
      const res = await createNewDepartment(dept, accessToken);

      if (res.data) {
        setDepartmentData((prevItems) => [...prevItems, res.data]);
        Alert.alert("Success", "You added a new department!");
        setDept({
          name: "",
          description: "",
        });
        setShowAddDept(false);
      }
    } catch (error) {
      Alert.alert("Error!", error.message);
    } finally {
      setIsDeptLoading(false);
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
                Manage Departments
              </Text>
              <TouchableOpacity
                className="px-4 flex flex-row"
                onPress={() => setShowAddDept(true)}
              >
                <Image
                  source={icons.plus}
                  resizeMode="contain"
                  tintColor="#FEA13D"
                  className="w-8 h-8"
                />
              </TouchableOpacity>
            </View>

            {sortedDepartment && sortedDepartment.length <= 0 ? null : (
              <>
                {sortedDepartment.map((dept, index) => (
                  <View
                    key={index}
                    className="flex flex-row items-center justify-between w-full border-b-2 border-gray-200 mt-5 py-3 px-5"
                  >
                    <Text>{dept.name}</Text>
                    <View className="flex flex-row gap-3">
                      <View className="flex flex-row mr-2">
                        <TouchableOpacity
                          className="mr-3"
                          // onPress={() => handleShowEditModal(event)}
                        >
                          <Icon name="edit" size={20} color="#FEA13D" />
                        </TouchableOpacity>
                        <TouchableOpacity
                        // onPress={() => handleShowDeleteModal(event)}
                        >
                          <Icon name="trash-alt" size={20} color="red" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddDept}
        onRequestClose={() => setShowAddDept(false)}
      >
        <SafeAreaView className="bg-primary h-full mb-10">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <FlatList
              data={[{ key: "department" }]}
              renderItem={() => (
                <View className="w-full justify-center px-4 my-10">
                  <Text className="text-2xl text-secondary-200 font-psemibold">
                    Add New Department
                  </Text>
                  <FormField
                    title="Department"
                    value={dept.name}
                    placeholder="Enter Department Name"
                    handleChangeText={(e) => handleChangeAdd("name", e)}
                    otherStyles="mt-5"
                  />

                  <FormField
                    title="Description"
                    value={dept.description}
                    placeholder="Enter Description"
                    handleChangeText={(e) => handleChangeAdd("description", e)}
                    otherStyles="mt-5"
                  />

                  <CustomButton
                    title="Create"
                    handlePress={addDepartmentBtn}
                    containerStyles="mt-14"
                  />

                  <CustomButton
                    title="Cancel"
                    handlePress={() => setShowAddDept(false)}
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

export default Departments;
