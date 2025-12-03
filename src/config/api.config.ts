/**
 * API CONFIGURATION
 * =================
 * Central configuration for API endpoints
 */

export const API_CONFIG = {
  // Base API URL - Change this if your backend is running on a different port or host
    BASE_URL: 'http://localhost:5002/api',

  // BASE_URL: import.meta.env.VITE_API_URL,

  // Timeout for API requests (in milliseconds)
  TIMEOUT: 30000,
  
  // Enable credentials (cookies, authorization headers)
  WITH_CREDENTIALS: true,
  
  // Rate limiting
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 900000, // 15 minutes
  },
};

// Helper to get API URL with environment variable support
export const getApiUrl = (): string => {
  const url = import.meta.env.VITE_API_URL ?? API_CONFIG.BASE_URL;

  console.log("📡 API URL:", url);

  return url;
};

export default API_CONFIG;
