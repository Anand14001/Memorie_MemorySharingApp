import React, { useEffect, useContext } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, Alert, ToastAndroid, TouchableOpacity } from 'react-native';
import { MemoryContext } from '../Context/MemoryContext';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';

const MemoryListScreen = ({ navigation }) => {
  // Get memories and functions from the MemoryContext
  const { memories, loadMemories, deleteMemory } = useContext(MemoryContext);

  useEffect(() => {
    // Function to fetch memories when the screen is focused
    const fetchMemories = async () => {
      await loadMemories(); // Load memories from the context
      console.log("Loaded memories:", memories); // Log to verify loaded memories
    };
  
    fetchMemories(); // Initial fetch
    // Set up navigation listener to fetch memories when the screen is focused
    const unsubscribe = navigation.addListener('focus', fetchMemories);
  
    return unsubscribe; // Clean up the listener on unmount
  }, [navigation]);

  // Render each memory item
  const renderMemory = ({ item }) => { 
    console.log(`Rendering memory: ${item.mediaUri}, Type: ${item.mediaType}`); // Log current memory being rendered
    return(
    <TouchableOpacity onPress={() => handleMemoryPress(item)}>
      <View style={styles.memoryItem}>
        <View style={styles.header}>
          <View>
            <Text style={styles.memoryTitle}>{item.title}</Text>
            <Text style={styles.memoryTimestamp}>
              {new Date(item.timestamp).toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleDeletePress(item)}>
            <Icon name='delete' size={30} />
          </TouchableOpacity>
        </View>
        {item.mediaType.startsWith('image') && (
          <Image source={{ uri: item.mediaUri }} style={styles.memoryImage} />
        )}
        {item.mediaType.startsWith('video') && (
          <Video
            source={{ uri: item.mediaUri }}
            style={styles.memoryVideo}
            paused={true}
            controls={true}
          />
        )}
        {item.mediaType.startsWith('audio') && (
          <View style={styles.audioContainer}>
            <Icon1 name='musical-notes' size={50} />
            <Text>Audio Memory</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );}

  const handleMemoryPress = (memory) => {
    // Navigate to FullScreenMedia for all types, including audio
    navigation.navigate('FullScreenMedia', {
      mediaUri: memory.mediaUri,
      mediaType: memory.mediaType,
      isAudio: memory.mediaType.startsWith('audio'), // Pass whether it's audio
      timestamp: memory.timestamp,
    });
  };

  const playAudio = (uri) => {
    const sound = new Sound(uri, (error) => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
      sound.play(() => {
        sound.release();
      });
    });
  };

  const handleDeletePress = (memory) => {
    Alert.alert(
      "Delete Memory",
      "Are you sure you want to delete this memory?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => {
            deleteMemory(memory.timestamp);
            ToastAndroid.show('Memory cleared', ToastAndroid.SHORT);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.Container}>
      <Pressable style={styles.Button} onPress={() => navigation.navigate('upload')}>
        <Text style={styles.Buttontxt}>Upload New Memory</Text>
      </Pressable>
      <FlatList
        data={memories}
        keyExtractor={(item) => item.timestamp.toString()}
        renderItem={renderMemory}
        ListEmptyComponent={
          <Text style={styles.noMemoriesText}>No memories saved.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 30,
  },
  memoryItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  memoryTitle: {
    fontWeight: 'bold',
  },
  memoryTimestamp: {
    fontSize: 12,
    color: 'gray',
  },
  memoryImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  memoryVideo: {
    width: '100%',
    height: 200,
  },
  Button: {
    backgroundColor: 'orange',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  Buttontxt: {
    fontWeight: 'bold',
    color: '#ffff',
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  audioContainer: {
    flexDirection: 'column',
    
  },
  noMemoriesText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginTop: 20,
  },
});

export default MemoryListScreen;
