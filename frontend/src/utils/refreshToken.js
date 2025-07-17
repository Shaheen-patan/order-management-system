import axios from 'axios';

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    throw new Error('No refresh token found');
  }

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: refresh,
    });
    const { access } = response.data;
    localStorage.setItem('access_token', access); // update new access token
    return access;
  } catch (err) {
    console.error('Refresh token failed:', err.response?.data || err.message);
    throw err;
  }
};
