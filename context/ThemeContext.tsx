"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext({
    theme: "light",
    setTheme: (theme: string) => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<string | undefined>(undefined);

    useEffect(() => {
        const cookieTheme = Cookies.get("theme") || localStorage.getItem("theme") || "light";
        setThemeState(cookieTheme);
        localStorage.setItem("theme", cookieTheme)
    }, []);

    useEffect(() => {
        const html = document.documentElement
        if (theme) {
            html.setAttribute("data-theme", theme)
            Cookies.set("theme", theme)
            localStorage.setItem("theme", theme)
        }
    }, [theme])

    const setTheme = (newTheme: string) => {
        setThemeState(newTheme);
    };

    if (!theme) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);