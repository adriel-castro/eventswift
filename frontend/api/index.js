import axios from "axios";
import { baseURL } from "../constants";

const url = baseURL;

export const login = (username, password) => {
  return axios.post(`${url}/auth/login`, { username, password });
};

export const signup = (data) => {
  return axios.post(`${url}/auth/signup`, data);
};

export const authMe = (accessToken) => {
  return axios.get(`${url}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllUsers = (accessToken) => {
  return axios.get(`${url}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const editUser = (id, data, accessToken) => {
  return axios.put(`${url}/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const removeUser = (id, accessToken) => {
  return axios.delete(`${url}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllDepartments = () => {
  return axios.get(`${url}/departments`);
};

export const addNewDepartment = (data, accessToken) => {
  return axios.post(`${url}/departments/add`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const editDepartment = (id, data, accessToken) => {
  return axios.put(`${url}/departments/${id}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const removeDepartment = (id, accessToken) => {
  return axios.delete(`${url}/departments/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllEvents = (accessToken) => {
  return axios.get(`${url}/events`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const addEvent = (data, accessToken) => {
  return axios.post(`${url}/events/add`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const editEvent = (eventId, data, accessToken) => {
  return axios.put(`${url}/events/${eventId}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const removeEvent = (eventId, accessToken) => {
  return axios.delete(`${url}/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const generateQRCode = (eventId, accessToken) => {
  return axios.get(`${url}/qrcode/generate/${eventId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getUserEventLogs = (eventId, accessToken) => {
  return axios.get(`${url}/attendance/${eventId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const checkInToEvent = (eventId, accessToken) => {
  return axios.post(
    `${url}/attendance/checkin/${eventId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const updateEventTimeStamps = (eventId, accessToken) => {
  return axios.put(
    `${url}/attendance/timestamp-logs/${eventId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const wifiConnectionStatus = () => {
  return axios.get(`${url}/wifi/check`);
};

export const addEventFeedback = (eventId, accessToken, data) => {
  return axios.post(`${url}/feedback/${eventId}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
