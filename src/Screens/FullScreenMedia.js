import React, { useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Modal, TouchableOpacity, Text, BackHandler, Alert, ToastAndroid } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MemoryContext } from '../Context/MemoryContext';

// FullScreenMedia component to display images or videos in full-screen mode
const FullScreenMedia = ({ route, navigation }) => {
  // Extract media URI and media type from route parameters
  const { mediaUri, mediaType, timestamp } = route.params;
  const { deleteMemory } = useContext(MemoryContext);

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Memory",
      "Are you sure you want to delete this memory?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            deleteMemory(timestamp); // Delete memory using timestamp
            navigation.goBack(); // Navigate back after deletion
            ToastAndroid.show('Memory cleared', ToastAndroid.SHORT);
          },
        },
      ]
    );
  };

  React.useLayoutEffect(() => {
    // This effect sets the navigation header options for the FullScreenMedia screen.
    // It runs when the component is mounted or when any dependencies change.
    navigation.setOptions({
      // Add a "Delete" icon button on the right side of the header.
      // When pressed, it triggers the handleDeletePress function.
      headerRight: () => (
        <TouchableOpacity onPress={handleDeletePress}>
            <Icon name='delete' size={25} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]); // Dependency array ensures the effect runs only if 'navigation' changes.


  useEffect(() => {
    // Function to handle back button press
    const backAction = () => {
      navigation.goBack(); // Navigate back to the previous screen
      return true; // Indicate that the event has been handled
    };

    // Set up the back handler to intercept hardware back button presses
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Clean up the back handler on component unmount
    return () => backHandler.remove();
  }, [navigation]); // Dependency array to re-run the effect when navigation changes

  return (
    <View style={styles.container}>
      {mediaType.startsWith('image') ? (
        <Image source={{ uri: mediaUri }} style={styles.image} />
      ) : (
        <Video
          source={{ uri: mediaUri }}
          style={styles.video}
          controls={true}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    padding: 10,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default FullScreenMedia;
