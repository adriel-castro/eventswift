import AsyncStorage from "@react-native-async-storage/async-storage";
import * as api from "../api";

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
    const session = await AsyncStorage.removeItem("access_token");

    return session;
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
    const department = await api.getAllDepartments();
    return department.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const getEvents = async () => {
  try {
    const event = await api.getAllEvents();
    return event.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const createEvent = async () => {
  try {
    const event = await api.addEvent();
    return event.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const updateEvent = async () => {
  try {
    const event = await api.editEvent();
    return event.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};

export const deleteEvent = async () => {
  try {
    const event = await api.removeEvent();
    return event.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      const errorMessage = error.response.data.errors[0].message;
      throw new Error(errorMessage);
    } else {
      throw new Error(error.message);
    }
  }
};
