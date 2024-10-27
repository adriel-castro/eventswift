import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";

import { icons } from "../../constants";
import { getEvents } from "../../lib/db";
import { useGlobalContext } from "../../context/GlobalProvider";
import InfoBox from "../../components/InfoBox";
import useRefresh from "../../lib/useRefresh";
import Icon from "react-native-vector-icons/FontAwesome5";

const Account = () => {
  const { user, logout, accessToken } = useGlobalContext();
  const { data: eventsData } = useRefresh(() => getEvents(accessToken));

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={[{ key: "account" }]}
        ListHeaderComponent={() => (
          <View className="w-full flex mt-6 mb-12 px-4">
            <View className="flex flex-row justify-end gap-4">
              <TouchableOpacity
              // onPress={logout}
              >
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
                <InfoBox title="6" subtitle="Attended" titleStyles="text-xl" />
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

            {/* {isUserOpen && (
              <View>
                <TouchableOpacity
                  className="flex flex-row items-center justify-between w-full p-3 border border-gray-200 rounded-lg"
                  // onPress={onToggle}
                >
                  <Text className="ml-4">Add User</Text>
                  <Icon name="user-plus" size={20} color="#FEA13D" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex flex-row items-center justify-between w-full p-3 border border-gray-200 rounded-lg"
                  // onPress={onToggle}
                >
                  <Text className="ml-4">Edit User</Text>
                  <Icon name="user-edit" size={20} color="#FEA13D" />
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );
};

export default Account;
