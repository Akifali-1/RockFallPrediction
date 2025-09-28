import React, { createContext, useContext, useState, useCallback } from 'react';
import { getCurrentMineData, getAllMines, getCriticalMines } from '../mockData';

const MineContext = createContext();

export const useMine = () => {
  const context = useContext(MineContext);
  if (!context) {
    throw new Error('useMine must be used within a MineProvider');
  }
  return context;
};

export const MineProvider = ({ children }) => {
  const [selectedMine, setSelectedMine] = useState('karimnagar');
  const [searchQuery, setSearchQuery] = useState('');

  // Get current mine data
  const currentMine = getCurrentMineData(selectedMine);
  
  // Get all mines
  const allMines = getAllMines();
  
  // Get critical mines
  const criticalMines = getCriticalMines();

  // Mine selection handler
  const handleMineSelection = useCallback((mineId) => {
    setSelectedMine(mineId);
  }, []);

  // Search handler
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Filter mines based on search
  const filteredMines = allMines.filter(mine => 
    mine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mine.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mine.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const value = {
    selectedMine,
    currentMine,
    allMines,
    criticalMines,
    filteredMines,
    searchQuery,
    handleMineSelection,
    handleSearchChange,
    setSelectedMine,
    setSearchQuery
  };

  return (
    <MineContext.Provider value={value}>
      {children}
    </MineContext.Provider>
  );
};
