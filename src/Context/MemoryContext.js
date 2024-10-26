import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context for managing memories
export const MemoryContext = createContext();

// MemoryProvider component to provide memory context to children
export const MemoryProvider = ({ children }) => {
  // State to hold the list of memories
  const [memories, setMemories] = useState([]);

  // Function to load memories from AsyncStorage
  const loadMemories = async () => {
    const storedMemories = await AsyncStorage.getItem('memories'); // Retrieve stored memories
    if (storedMemories) {
      const parsedMemories = JSON.parse(storedMemories); // Parse the stored string back to an array
      console.log("Loaded memories from storage:", parsedMemories); // Check loaded memories
      setMemories(parsedMemories); // Update the state with loaded memories
    } else {
      console.log("No memories found in storage."); // Log if no memories are found
    }
  };
  
  // Function to add a new memory
  const addMemory = async (memory) => {
    const newMemories = [...memories, memory]; // Create a new array with the added memory
    console.log("Adding memory:", memory); // Check memory being added
    setMemories(newMemories); // Update state with new memory list
    await AsyncStorage.setItem('memories', JSON.stringify(newMemories)); // Save updated memories to AsyncStorage
  };
  
  // Function to delete a memory by its timestamp
  const deleteMemory = async (timestamp) => {
    const updatedMemories = memories.filter(memory => memory.timestamp !== timestamp); // Filter out the memory to delete
    console.log("Deleting memory with timestamp:", timestamp); // Check memory being deleted
    setMemories(updatedMemories); // Update state with remaining memories
    await AsyncStorage.setItem('memories', JSON.stringify(updatedMemories)); // Save updated memories to AsyncStorage
  };

  // Provide the context value to children components

  return (
    <MemoryContext.Provider value={{ memories, addMemory, loadMemories, deleteMemory }}>
      {children}
    </MemoryContext.Provider>
  );
};
