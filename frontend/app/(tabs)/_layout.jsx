import { View, Text, Image, Platform } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/FontAwesome5";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FEA13D",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            // backgroundColor: "#161622",
            backgroundColor: "#016738",
            borderTopWidth: 1,
            // borderTopColor: "#232533",
            borderTopColor: "#F3F5AD",
            height: 84,
            paddingTop: Platform.OS === "ios" ? 20 : 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <>
                <View className="items-center justify-center gap-2">
                  <Icon
                    name="calendar"
                    size={25}
                    color={color}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                  <Text
                    className={`${
                      focused ? "font-psemibold" : "font-pregular"
                    } text-xs`}
                    style={{ color: color }}
                  >
                    Events
                  </Text>
                </View>
              </>
            ),
          }}
        />
        <Tabs.Screen
          name="attendance"
          options={{
            title: "Attendance",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <>
                <View className="items-center justify-center gap-2">
                  <Icon
                    name="calendar-check"
                    size={25}
                    color={color}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                  <Text
                    className={`${
                      focused ? "font-psemibold" : "font-pregular"
                    } text-xs`}
                    style={{ color: color }}
                  >
                    Attendance
                  </Text>
                </View>
              </>
            ),
          }}
        />
        {/* <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Bookmark"
                focused={focused}
              />
            ),
          }}
        /> */}
        {/* <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <>
                <View className="items-center justify-center gap-2">
                  <Icon
                    name="users-cog"
                    size={25}
                    color={color}
                    className="w-6 h-6"
                    resizeMode="contain"
                  />
                  <Text
                    className={`${
                      focused ? "font-psemibold" : "font-pregular"
                    } text-xs`}
                    style={{ color: color }}
                  >
                    Account
                  </Text>
                </View>
              </>
            ),
          }}
        />
      </Tabs>

      {/* <StatusBar backgroundColor="#016738" style="light" /> */}
      <StatusBar
        backgroundColor="#016738"
        style={Platform.OS === "ios" ? "" : "light"}
      />
    </>
  );
};

export default TabsLayout;
