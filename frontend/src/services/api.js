import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Student Prediction
export const predict = (data) => {
  return API.post('/predict', data);
};

export const predictStudent = (data) => {
  return API.post('/predict', data);
};

export const getModelInfo = () => {
  return API.get('/model-info');
};

export const getModelMetrics = () => {
  return API.get('/model-info/metrics');
};

export const getTrainingStatus = () => {
  return API.get('/train/status');
};

// Teacher Authentication
export const teacherRegister = (data) => {
  return API.post('/teacher/register', data);
};

export const teacherLogin = (data) => {
  return API.post('/teacher/login', data);
};

export const getTeacherInfo = (token) => {
  return API.get('/teacher/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Teacher CSV Upload
export const uploadCSV = (file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/teacher/upload/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const downloadCSVTemplate = () => {
  return API.get('/teacher/upload/download-template');
};

export default API;
