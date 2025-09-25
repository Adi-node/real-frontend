import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://namaste-frontend.vercel.app/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Token management
export const getToken = () => {
  return localStorage.getItem('authToken') || Cookies.get('authToken');
};

export const setToken = (token) => {
  localStorage.setItem('authToken', token);
  Cookies.set('authToken', token, { expires: 1 }); // 1 day
};

export const removeToken = () => {
  localStorage.removeItem('authToken');
  Cookies.remove('authToken');
};

// User data management
export const getUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const setUser = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('userData');
};

// Auth functions
export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });

    const { token, refreshToken, user } = response.data;
    
    // Store token and user data
    setToken(token);
    setUser(user);
    
    // Store refresh token if provided
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return { success: true, user, message: 'Login successful' };
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    return { success: false, message, error: error.response?.data };
  }
};

export const register = async (email, password, fullName) => {
  try {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      fullName,
    });

    const { token, refreshToken, user } = response.data;
    
    // Store token and user data
    setToken(token);
    setUser(user);
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    return { success: true, user, message: 'Registration successful' };
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    return { success: false, message, error: error.response?.data };
  }
};

export const logout = async () => {
  try {
    // Call logout endpoint to invalidate token on server
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if server call fails
    console.warn('Logout request failed:', error.message);
  } finally {
    // Clean up local storage
    removeToken();
    removeUser();
    localStorage.removeItem('refreshToken');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    const user = response.data.user;
    setUser(user); // Update stored user data
    return { success: true, user };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get user profile';
    return { success: false, message };
  }
};

export const updateProfile = async (fullName) => {
  try {
    const response = await apiClient.put('/auth/profile', { fullName });
    const user = response.data.user;
    setUser(user); // Update stored user data
    return { success: true, user, message: 'Profile updated successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update profile';
    return { success: false, message };
  }
};

export const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to change password';
    return { success: false, message };
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Check if user is admin
export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};

// Refresh token
export const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { token, refreshToken: newRefreshToken } = response.data;
    
    setToken(token);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }

    return { success: true };
  } catch (error) {
    logout();
    return { success: false };
  }
};

// Admin functions
export const getUsers = async (page = 1, limit = 20, search = '') => {
  try {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit, search },
    });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get users';
    return { success: false, message };
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get user';
    return { success: false, message };
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
    return { success: true, data: response.data, message: 'User role updated' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update user role';
    return { success: false, message };
  }
};

export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await apiClient.put(`/admin/users/${userId}/status`, { isActive });
    return { success: true, data: response.data, message: 'User status updated' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update user status';
    return { success: false, message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return { success: true, data: response.data, message: 'User deleted successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete user';
    return { success: false, message };
  }
};

export const getAuditLogs = async (params = {}) => {
  try {
    const response = await apiClient.get('/admin/audit', { params });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get audit logs';
    return { success: false, message };
  }
};

export const getAuditStats = async () => {
  try {
    const response = await apiClient.get('/admin/audit/stats');
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get audit stats';
    return { success: false, message };
  }
};

// Patient Record functions
export const createPatientRecord = async (patientData) => {
  try {
    const response = await apiClient.post('/patients', patientData);
    return { success: true, data: response.data, message: 'Patient record created successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create patient record';
    return { success: false, message };
  }
};

export const getPatientRecords = async (params = {}) => {
  try {
    const response = await apiClient.get('/patients', { params });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get patient records';
    return { success: false, message };
  }
};

export const getPatientRecordById = async (patientId) => {
  try {
    const response = await apiClient.get(`/patients/${patientId}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get patient record';
    return { success: false, message };
  }
};

export const updatePatientRecord = async (patientId, patientData) => {
  try {
    const response = await apiClient.put(`/patients/${patientId}`, patientData);
    return { success: true, data: response.data, message: 'Patient record updated successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update patient record';
    return { success: false, message };
  }
};

export const deletePatientRecord = async (patientId) => {
  try {
    const response = await apiClient.delete(`/patients/${patientId}`);
    return { success: true, data: response.data, message: 'Patient record deleted successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete patient record';
    return { success: false, message };
  }
};

// Patient Visit functions
export const createPatientVisit = async (patientId, visitData) => {
  try {
    const response = await apiClient.post(`/patients/${patientId}/visits`, visitData);
    return { success: true, data: response.data, message: 'Patient visit created successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create patient visit';
    return { success: false, message };
  }
};

export const getPatientVisits = async (patientId, params = {}) => {
  try {
    const response = await apiClient.get(`/patients/${patientId}/visits`, { params });
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get patient visits';
    return { success: false, message };
  }
};

export const getPatientVisitById = async (patientId, visitId) => {
  try {
    const response = await apiClient.get(`/patients/${patientId}/visits/${visitId}`);
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get patient visit';
    return { success: false, message };
  }
};

export const updatePatientVisit = async (patientId, visitId, visitData) => {
  try {
    const response = await apiClient.put(`/patients/${patientId}/visits/${visitId}`, visitData);
    return { success: true, data: response.data, message: 'Patient visit updated successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update patient visit';
    return { success: false, message };
  }
};

export const deletePatientVisit = async (patientId, visitId) => {
  try {
    const response = await apiClient.delete(`/patients/${patientId}/visits/${visitId}`);
    return { success: true, data: response.data, message: 'Patient visit deleted successfully' };
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete patient visit';
    return { success: false, message };
  }
};

export default apiClient;