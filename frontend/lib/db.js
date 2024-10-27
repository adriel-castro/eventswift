import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../api";
import { errorHelper } from "../helpers/error.helper";

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

export const signOut = async () => {
  try {
    await AsyncStorage.removeItem("access_token");
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
    console.log("dept error", error)
    let errorMessage;
    if (error?.response?.data?.errors?.length > 0) {
      errorMessage = error?.respons?.data?.errors[0]?.message;
      throw new Error(errorMessage);
    } else if (error?.response?.data?.errors) {
      errorMessage = error?.response?.data?.errors?.message;
      throw new Error(errorMessage);
    }
  }
};

export const getEvents = async (token) => {
  try {
    const event = await api.getAllEvents(token);
    return event.data;
  } catch (error) {
    errorHelper(error);
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

export const eventCheckIn = async (id, token) => {
  try {
    const res = await api.checkInToEvent(id, token);
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
    errorHelper(error);
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
