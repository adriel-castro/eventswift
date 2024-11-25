import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../api";
import { errorHelper } from "../helpers/error.helper";
import { router } from "expo-router";

export const loginUser = async (username, password) => {
  try {
    const data = await api.login(username, password);
    return data.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const signUpUser = async (data) => {
  try {
    const res = await api.signup(data);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const resetPassword = async (data, token) => {
  try {
    const res = await api.resetPass(data, token);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const getCurrentUser = async (token) => {
  try {
    const user = await api.authMe(token);
    return user.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const getUsers = async (token) => {
  try {
    const user = await api.getAllUsers(token);
    return user.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const getUserAccount = async (id, token) => {
  try {
    const user = await api.getUserById(id, token);
    return user.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const updateUser = async (id, data, token) => {
  try {
    const res = await api.editUser(id, data, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const deleteUser = async (id, token) => {
  try {
    const res = await api.removeUser(id, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const uploadUserFiles = async (formData, token) => {
  try {
    const res = await api.uploadUsers(formData, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const signOut = async () => {
  try {
    await AsyncStorage.removeItem("access_token");
    router.replace("/login");
    // await AsyncStorage.removeItem("joined_event");
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const getDepartments = async () => {
  try {
    const res = await api.getAllDepartments();
    const department = res?.data;
    return department;
  } catch (error) {
    const errorMessage = error?.response?.data?.error?.message;
    throw new Error(errorMessage);
  }
};

export const createNewDepartment = async (data, token) => {
  try {
    const res = await api.addNewDepartment(data, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const updateDepartment = async (id, data, token) => {
  try {
    const res = await api.editDepartment(id, data, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const deleteDepartment = async (id, token) => {
  try {
    const res = await api.removeDepartment(id, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const getDepartmentEvents = async (userId, token) => {
  try {
    const event = await api.getAllEventInDepartment(userId, token);
    return event.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const getEvents = async (token) => {
  try {
    const event = await api.getAllEvents(token);
    return event.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
    throw new Error(errorMessage);
  }
};

export const createNewEvent = async (data, token) => {
  try {
    const event = await api.addEvent(data, token);
    return event.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const updateEvent = async (id, data, token) => {
  try {
    const event = await api.editEvent(id, data, token);
    return event.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const deleteEvent = async (id, token) => {
  try {
    const event = await api.removeEvent(id, token);
    return event.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const createQRCode = async (id, token) => {
  try {
    const qr = await api.generateQRCode(id, token);
    return qr.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const getEventLogs = async (id, token) => {
  try {
    const res = await api.getUserEventLogs(id, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const importAttendance = async (eventId, formData, token) => {
  try {
    const res = await api.uploadAttendance(eventId, formData, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const eventCheckIn = async (id, token) => {
  try {
    const res = await api.checkInToEvent(id, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const eventAttendances = async (id, token) => {
  try {
    const res = await api.getAllAttendance(id, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const usersAttendance = async (token) => {
  try {
    const res = await api.getUserAttendance(token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const addTimeStamps = async (id, token) => {
  try {
    const res = await api.updateEventTimeStamps(id, token);
    return res.data;
  } catch (error) {
    const errorMessage = error.response.data.error.message;
    throw new Error(errorMessage);
  }
};

export const connectionStatus = async () => {
  try {
    const res = await api.wifiConnectionStatus();
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const createFeedback = async (eventId, token, data) => {
  try {
    const res = await api.addEventFeedback(eventId, token, data);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const getEventsFeedback = async (eventId, token) => {
  try {
    const res = await api.getFeedback(eventId, token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};

export const getAllFeedback = async (token) => {
  try {
    const res = await api.getAllEventsFeedback(token);
    return res.data;
  } catch (error) {
    errorHelper(error);
  }
};
