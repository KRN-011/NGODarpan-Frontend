import axios from 'axios';
import Cookies from 'js-cookie';

// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ===================================================
// Custom User Authentication
// ===================================================

// Register User
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
            console.log(response.data.data.user);
            
        }

        return response.data;
    } catch (error: any) {
        throw error;
    }
};

// Logout User
export const logoutUser = async (token: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/logout`, { token });
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

// Resend OTP 
export const resendOtp = async (token: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/resend-otp`, { token });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ===================================================
// Social Media Authentication
// ===================================================

// Social Media Authentication
export const socialMediaAuthentication = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/auth/social`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Logout User with Social Media 
export const logoutUserWithSocialMedia = async () => {
    try {
        const JWT_TOKEN =  Cookies.get('token');
        
        const response = await axios.post(`${API_URL}/auth/social/logout`, { data: JWT_TOKEN });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ===================================================
// Profile
// ===================================================

// Update Profile
export const updateProfile = async (data: any) => {
    const JWT_TOKEN =  Cookies.get('token');

    try {
        const response = await axios.post(`${API_URL}/profile/update`, data, {
            headers: {
                Authorization: `Bearer ${JWT_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Profile
export const getProfile = async () => {
    const JWT_TOKEN =  Cookies.get('token');

    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${JWT_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ===================================================
// NGO 
// ===================================================

// Create NGO
export const createNGO = async (data: any) => {
    const JWT_TOKEN =  Cookies.get('token');

    try {
        const response = await axios.post(`${API_URL}/ngo/create`, data, {
            headers: {
                Authorization: `Bearer ${JWT_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// ===================================================
// Miscellaneous
// ===================================================

// Upload Image
export const uploadImage = async (data: any, module: string) => {
    const JWT_TOKEN =  Cookies.get('token');

    try {
        const response = await axios.post(`${API_URL}/miscellaneous/upload-image`, {data, module}, {  
            headers: {
                Authorization: `Bearer ${JWT_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}