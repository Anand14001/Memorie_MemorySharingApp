import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MemoryContext = createContext();

export const MemoryProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);

  const loadMemories = async () => {
    const storedMemories = await AsyncStorage.getItem('memories');
    if (storedMemories) {
      const parsedMemories = JSON.parse(storedMemories);
      console.log("Loaded memories from storage:", parsedMemories); // Check loaded memories
      setMemories(parsedMemories);
    } else {
      console.log("No memories found in storage.");
    }
  };
  
  const addMemory = async (memory) => {
    const newMemories = [...memories, memory];
    console.log("Adding memory:", memory); // Check memory being added
    setMemories(newMemories);
    await AsyncStorage.setItem('memories', JSON.stringify(newMemories));
  };
  
  const deleteMemory = async (timestamp) => {
    const updatedMemories = memories.filter(memory => memory.timestamp !== timestamp);
    console.log("Deleting memory with timestamp:", timestamp); // Check memory being deleted
    setMemories(updatedMemories);
    await AsyncStorage.setItem('memories', JSON.stringify(updatedMemories));
  };

  return (
    <MemoryContext.Provider value={{ memories, addMemory, loadMemories, deleteMemory }}>
      {children}
    </MemoryContext.Provider>
  );
};
