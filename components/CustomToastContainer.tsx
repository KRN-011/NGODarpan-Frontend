"use client";
import { ToastContainer } from "react-toastify";
import { useTheme } from "@/context/ThemeContext";

export default function CustomToastContainer() {
    const { theme } = useTheme();
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === "light" ? "light" : "dark"}
            style={{ zIndex: 99999 }}
            className="!fixed"
        /> 
    );
}