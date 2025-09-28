import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MineSelector from './MineSelector';
import ThemeToggle from './ThemeToggle';

const PageHeader = ({
    title,
    description,
    icon: Icon,
    showMineSelector = true,
    showThemeToggle = true,
    showSearch = false,
    children
}) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
            {/* Title Row */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left side - Title and description */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                        {Icon && (
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                                <Icon className="h-6 w-6 text-white" />
                            </div>
                        )}
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 truncate">
                            {title}
                        </h1>
                    </div>
                    {description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                            {description}
                        </p>
                    )}
                </div>

                {/* Theme Toggle - Always in top right */}
                {showThemeToggle && (
                    <div className="flex-shrink-0">
                        <ThemeToggle />
                    </div>
                )}
            </div>

            {/* Controls Row - Mine Selector and Children */}
            {(showMineSelector || children) && (
                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
                    {/* Mine Selector */}
                    {showMineSelector && (
                        <div className="w-full sm:w-auto">
                            <MineSelector />
                        </div>
                    )}

                    {/* Additional children - can wrap to new lines */}
                    {children && (
                        <div className="flex flex-wrap items-center gap-4 flex-1">
                            {children}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PageHeader;