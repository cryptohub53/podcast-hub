// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  contact: `${API_BASE_URL}/contact`,
  podcasts: `${API_BASE_URL}/podcasts`,
};
