import { createContext } from "react";
import { ThemeContext } from "./ThemeContext";

function NavBar() {
    const {theme, toggleTheme} = createContext(ThemeContext);
    
}