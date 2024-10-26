import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, ToastAndroid, BackHandler, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker'; // Import for file selection
import { MemoryContext } from '../Context/MemoryContext'; // Import context for memory management
import { PermissionsAndroid } from 'react-native'; // Import for requesting permissions
import Video from 'react-native-video'; // Import for video playback
import Icon from 'react-native-vector-icons/Ionicons'; // Import for icons
import ActionSheet from 'react-native-actionsheet'; // Import for action sheets
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Import for image and video capture


const MemoryUploadScreen = ({ navigation }) => {
  const { addMemory } = useContext(MemoryContext); // Get the addMemory function from MemoryContext
  const [title, setTitle] = useState(''); // State for memory title
  const [mediaUri, setMediaUri] = useState(null); // State for media URI
  const [mediaType, setMediaType] = useState(''); // State for media type
  const [showTitleWarning, setShowTitleWarning] = useState(false); // State for showing title warning
  let actionSheetRef = React.createRef(); // Reference for action sheet

  // Function to request permissions for external storage
  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]);
      return granted; // Return the granted permissions
    } catch (err) {
      Alert.alert('Permission error', 'Could not get permissions'); // Alert on permission error
      return false; // Return false if permissions were not granted
    }
  };

 // Function to select media from the image library
 const selectMedia1 = async () => {
  const permissionsGranted = await requestPermissions(); // Request permissions
  if (!permissionsGranted) {
    return; // Exit if permissions were not granted
  }

  try {
    const response = await launchImageLibrary({
      mediaType: 'mixed', // Specify media types to select (mixed = both photo and video)
      selectionLimit: 1, // Limit selection to one item
    });

    if (response.didCancel) {
      console.log('User cancelled image picker'); // Log if user cancels
    } else if (response.error) {
      console.error('ImagePicker Error: ', response.error); // Log any errors
    } else {
      const selectedAsset = response.assets[0]; // Get the selected asset
      setMediaUri(selectedAsset.uri); // Set media URI
      setMediaType(selectedAsset.type); // Set media type

      if (!title) {
        setShowTitleWarning(true); // Show warning if title is missing
      }
    }
  } catch (err) {
    console.error('Error selecting media: ', err); // Log any errors
  }
};

// Function to select media files using DocumentPicker
const selectMedia = async () => {
  const permissionsGranted = await requestPermissions(); // Request permissions
  if (!permissionsGranted) {
    return; // Exit if permissions were not granted
  }

  try {
    const response = await DocumentPicker.pick({
      type: DocumentPicker.types.allFiles, // Allow selection of all file types
    });

    const selectedAsset = response[0]; // Get the selected asset
    setMediaUri(selectedAsset.uri); // Set media URI
    setMediaType(selectedAsset.type); // Set media type

    if (!title) {
      setShowTitleWarning(true); // Show warning if title is missing
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled document picker'); // Log if user cancels
    } else {
      console.error('DocumentPicker Error: ', err); // Log any errors
    }
  }
};

 // Function to show options for selecting media
 const showMediaOptions = () => {
  Alert.alert(
    "Select Media",
    "Choose an option",
    [
      {
        text: "Image/Video",
        onPress: () => selectMedia1(), // Proceed with image/video selection
      },
      {
        text: "Audio",
        onPress: () => selectMedia(), // Proceed with audio selection
      },
      {
        text: "Cancel",
        style: "cancel", // Cancel option
      }
    ],
    { cancelable: true }
  );
};

// Function to show options for capturing media
const captureMemory = () => {
  actionSheetRef.current.show(); // Show action sheet for capture options
};

// Function to handle user's selection from action sheet
const handleCaptureOption = (index) => {
  const options = ['Capture Photo', 'Capture Video', 'Record Audio', 'Cancel'];
  if (index === 0) { // Capture Photo
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera'); // Log if user cancels
      } else if (response.error) {
        console.error('Camera Error: ', response.error); // Log any errors
      } else {
        setMediaUri(response.assets[0].uri); // Set media URI
        setMediaType(response.assets[0].type); // Set media type

        if (!title) {
          setShowTitleWarning(true); // Show warning if title is missing
        }
      }
    });
  } else if (index === 1) { // Capture Video
    launchCamera({ mediaType: 'video', saveToPhotos: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera'); // Log if user cancels
      } else if (response.error) {
        console.error('Camera Error: ', response.error); // Log any errors
      } else {
        setMediaUri(response.assets[0].uri); // Set media URI
        setMediaType(response.assets[0].type); // Set media type

        if (!title) {
          setShowTitleWarning(true); // Show warning if title is missing
        }
      }
    });
  } else if (index === 2) { // Record Audio (not implemented yet)
    console.log('Record Audio'); // Placeholder for audio recording logic
  }
};

// Function to save the memory
const saveMemory = () => {
  if (!title || !mediaUri) { // Check if title and media are provided
    Alert.alert('Error', 'Please provide a title and select a media.'); // Alert user
    return; // Exit if validation fails
  }

  const newMemory = {
    title,
    mediaUri,
    mediaType,
    timestamp: new Date(), // Add timestamp
  };

  ToastAndroid.showWithGravity('Memory saved successfully!', ToastAndroid.SHORT, ToastAndroid.CENTER); // Show success message
  addMemory(newMemory); // Add memory to context
  navigation.navigate('list'); // Navigate to list screen
};

// Function to handle title input changes
const handleTitleChange = (value) => {
  setTitle(value); // Update title state
  if (value) {
    setShowTitleWarning(false); // Hide warning if title is present
  }
};

// Effect to handle hardware back button
useEffect(() => {
  const backAction = () => {
    navigation.goBack(); // Go back on hardware back button press
    return true;
  };

  const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction); // Add event listener for back button

  return () => backHandler.remove(); // Clean up event listener on unmount
}, []);

// Function to render selected media based on its type
const renderMedia = () => {
  if (!mediaUri) return null; // Return null if no media URI is set

  if (mediaType.startsWith('image/')) { // If media is an image
    return (
      <Image
        source={{ uri: mediaUri }} // Display the image
        style={{ width: '100%', height: 200, marginVertical: 10 }} // Style for the image
        resizeMode="contain" // Resize mode
      />
    );
  }

  if (mediaType.startsWith('video/')) { // If media is a video
    return (
      <Video
        source={{ uri: mediaUri }} // Play the video
        style={{ width: '100%', height: 200, marginVertical: 10 }} // Style for the video
        resizeMode="contain" // Resize mode
        controls // Show video controls
      />
    );
  }

  if (mediaType.startsWith('audio/')) { // If media is audio
    return (
      <View style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10, elevation: 2, flexDirection: 'row', alignItems: 'center' }}>
        <Icon name='musical-notes' size={50} /> {/* Display audio icon */}
        <Text style={{ fontWeight: 'bold' }}>Your memory is ready to upload!</Text> {/* Text for audio */}
      </View>
    );
  }

  return null; // Return null if media type is not recognized
};

  return (
    <View style={{ padding: 20 }}>
      <Text style={showTitleWarning ? Styles.warningText : null}>
        {showTitleWarning ? "Title is required to save your memory!" : "Title"}
      </Text>

      <TextInput
        placeholder="Enter memory title"
        value={title}
        onChangeText={handleTitleChange}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      {renderMedia()}

      <TouchableOpacity style={Styles.Button} onPress={showMediaOptions}>
        <Text style={Styles.Buttontxt}>Select Memory</Text>
      </TouchableOpacity>

      <TouchableOpacity style={Styles.Button} onPress={captureMemory}>
        <Text style={Styles.Buttontxt}>Capture Memory</Text>
      </TouchableOpacity> 

      <TouchableOpacity
        style={[Styles.Button, (!title || !mediaUri) && Styles.ButtonDisabled]}
        onPress={saveMemory}
        disabled={!title || !mediaUri}
      >
        <Text style={Styles.Buttontxt}>Save Memory</Text>
      </TouchableOpacity>

      <ActionSheet
        ref={actionSheetRef}
        options={[
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Icon name='camera-outline' size={20} />
            <Text style={{ fontWeight: '400', fontSize: 20, marginLeft: 10 }}>Capture Photo</Text>
          </View>,
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Icon name='videocam-outline' size={20} />
            <Text style={{ fontWeight: '400', fontSize: 20, marginLeft: 10 }}>Capture Video</Text>
          </View>,
          <Text style={{ fontWeight: '400', fontSize: 20, color: 'red' }}>Cancel</Text>,
        ]}
        cancelButtonIndex={2}
        onPress={handleCaptureOption}
      />
    </View>
  );
};

export default MemoryUploadScreen;

const Styles = StyleSheet.create({
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
  ButtonDisabled: {
    backgroundColor: '#ffd1a6',
  },
  warningText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
