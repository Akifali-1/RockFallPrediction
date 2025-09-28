import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, MapPin, Users, AlertCircle } from 'lucide-react';
import { useMine } from '../contexts/MineContext';
import { useTheme } from '../contexts/ThemeContext';

const MineSelector = ({ className = "" }) => {
  const {
    selectedMine,
    currentMine,
    filteredMines,
    searchQuery,
    handleMineSelection,
    handleSearchChange
  } = useMine();

  const { isDarkMode } = useTheme();

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search mines by name or location..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-56 pl-10 pr-4 transition-all duration-200 focus:w-64"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Mine Selector */}
      <Select value={selectedMine} onValueChange={handleMineSelection}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select a mine" />
        </SelectTrigger>
        <SelectContent>
          {filteredMines.map((mine) => (
            <SelectItem key={mine.id} value={mine.id}>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${mine.riskLevel === 'Critical' ? 'bg-red-500' :
                  mine.riskLevel === 'High' ? 'bg-orange-500' :
                    mine.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                <span>{mine.name}</span>
                <Badge variant={mine.riskLevel === 'Critical' ? 'destructive' :
                  mine.riskLevel === 'High' ? 'destructive' :
                    mine.riskLevel === 'Medium' ? 'secondary' : 'default'}>
                  {mine.riskLevel}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Current Mine Info */}
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${currentMine.riskLevel === 'Critical' ? 'bg-red-50 border-red-200' :
        currentMine.riskLevel === 'High' ? 'bg-orange-50 border-orange-200' :
          currentMine.riskLevel === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
        }`}>
        <MapPin className={`h-4 w-4 ${currentMine.riskLevel === 'Critical' ? 'text-red-600' :
          currentMine.riskLevel === 'High' ? 'text-orange-600' :
            currentMine.riskLevel === 'Medium' ? 'text-yellow-600' :
              'text-green-600'
          }`} />
        <div className="text-sm">
          <div className={`font-semibold ${currentMine.riskLevel === 'Critical' ? 'text-red-800' :
            currentMine.riskLevel === 'High' ? 'text-orange-800' :
              currentMine.riskLevel === 'Medium' ? 'text-yellow-800' :
                'text-green-800'
            }`}>{currentMine.name}</div>
          <div className={`text-xs ${currentMine.riskLevel === 'Critical' ? 'text-red-600' :
            currentMine.riskLevel === 'High' ? 'text-orange-600' :
              currentMine.riskLevel === 'Medium' ? 'text-yellow-600' :
                'text-green-600'
            }`}>{currentMine.location}</div>
        </div>
        <div className={`flex items-center space-x-1 text-xs ${currentMine.riskLevel === 'Critical' ? 'text-red-600' :
          currentMine.riskLevel === 'High' ? 'text-orange-600' :
            currentMine.riskLevel === 'Medium' ? 'text-yellow-600' :
              'text-green-600'
          }`}>
          <Users className="h-3 w-3" />
          <span>{currentMine.personnel}</span>
          <AlertCircle className="h-3 w-3 ml-1" />
          <span>{currentMine.alerts}</span>
        </div>
      </div>
    </div>
  );
};

export default MineSelector;
