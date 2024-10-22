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

export const getAllDepartments = () => {
  return axios.get(`${url}/departments/`);
};

export const getAllEvents = (accessToken) => {
  return axios.get(`${url}/events/`, {
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
