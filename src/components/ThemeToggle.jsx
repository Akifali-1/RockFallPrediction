import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = "" }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={`p-2 ${className}`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDarkMode ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    );
};

export default ThemeToggle;