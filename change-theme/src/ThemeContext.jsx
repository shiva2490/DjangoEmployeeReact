import { createContext, useState } from "react";

//creating context
export const ThemeContext = createContext();
//creating provider
export function ThemeProvider({children}){
    //state to hold the theme
    const [theme, setTheme]= useState("light")

    //toggle function
    const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

   //Return context provider
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

