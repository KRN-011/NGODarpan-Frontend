import axios from 'axios';
import Cookies from 'js-cookie';

// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// JWT Token
export const JWT_TOKEN = Cookies.get('token');

// ===================================================
// Custom User Authentication
// ===================================================

export const registerUser = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, data);

        if (response.data.success) {
            Cookies.set("token", response.data.data.token);
            Cookies.set("user", JSON.stringify(response.data.data.user));
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

// Login User
export const loginUser = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, data);

        if (response.data.success) {
            Cookies.set("token", response.data.data.token);
            Cookies.set("user", JSON.stringify(response.data.data.user));
        }

        return response.data;
    } catch (error: any) {
        throw error;
    }
};

// Logout User
export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/logout`, { id: JWT_TOKEN });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Verify User
export const verifyUser = async (otp: string, token: string) => {
    try {        
        const response = await axios.post(`${API_URL}/auth/verify`, { otp, token });
        return response.data;
    } catch (error) {
        throw error
    }
};

// ===================================================
// Social Media Authentication
// ===================================================

export const socialMediaAuthentication = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/auth/social`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUserWithSocialMedia = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/social/logout`, { data: JWT_TOKEN });
        return response.data;
    } catch (error) {
        throw error;
    }
};