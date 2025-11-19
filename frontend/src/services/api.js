import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predict = (data) => {
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

export default API;
