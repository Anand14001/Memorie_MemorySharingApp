import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, ToastAndroid, BackHandler, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { MemoryContext } from '../Context/MemoryContext';
import { PermissionsAndroid } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const MemoryUploadScreen = ({ navigation }) => {
  const { addMemory } = useContext(MemoryContext);
  const [title, setTitle] = useState('');  // State for memory title
  const [mediaUri, setMediaUri] = useState(null);  // State for media URI
  const [mediaType, setMediaType] = useState('');  // State for media type
  const [showTitleWarning, setShowTitleWarning] = useState(false);  // State to show warning if title is missing
  let actionSheetRef = React.createRef();  // Reference for ActionSheet

  // Function to request storage permissions
  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]);
      return granted;
    } catch (err) {
      Alert.alert('Permission error', 'Could not get permissions');
      return false;
    }
  };

  // Function to select image or video from library
  const selectMedia1 = async () => {
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) {
      return;
    }

    try {
      const response = await launchImageLibrary({
        mediaType: 'mixed',  // Allows both photo and video selection
        selectionLimit: 1,  // Only one item can be selected
      });

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        const selectedAsset = response.assets[0];
        setMediaUri(selectedAsset.uri);
        setMediaType(selectedAsset.type);

        if (!title) {
          setShowTitleWarning(true);
        }
      }
    } catch (err) {
      console.error('Error selecting media: ', err);
    }
  };

  // Function to select any file type using document picker
  const selectMedia = async () => {
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) {
      return;
    }

    try {
      const response = await DocumentPicker.pick({
        type: DocumentPicker.types.allFiles,
      });

      const selectedAsset = response[0];
      setMediaUri(selectedAsset.uri);
      setMediaType(selectedAsset.type);

      if (!title) {
        setShowTitleWarning(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.error('DocumentPicker Error: ', err);
      }
    }
  };

  // Function to display media selection options
  const showMediaOptions = () => {
    Alert.alert(
      "Select Media",
      "Choose an option",
      [
        { text: "Image/Video", onPress: () => selectMedia1() },
        { text: "Audio", onPress: () => selectMedia() },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  // Function to show action sheet for capturing new media
  const captureMemory = () => {
    actionSheetRef.current.show();
  };

  // Handler for options on capture action sheet
  const handleCaptureOption = (index) => {
    const options = ['Capture Photo', 'Capture Video', 'Record Audio', 'Cancel'];
    if (index === 0) {
      launchCamera({ mediaType: 'photo', saveToPhotos: true }, (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.error('Camera Error: ', response.error);
        } else {
          setMediaUri(response.assets[0].uri);
          setMediaType(response.assets[0].type);

          if (!title) {
            setShowTitleWarning(true);
          }
        }
      });
    } else if (index === 1) {
      launchCamera({ mediaType: 'video', saveToPhotos: true }, (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.error('Camera Error: ', response.error);
        } else {
          setMediaUri(response.assets[0].uri);
          setMediaType(response.assets[0].type);

          if (!title) {
            setShowTitleWarning(true);
          }
        }
      });
    } else if (index === 2) {
      console.log('Record Audio');
      // Implement audio recording logic here
    }
  };

  // Function to save the memory after validation
  const saveMemory = () => {
    if (!title || !mediaUri) {
      Alert.alert('Error', 'Please provide a title and select a media.');
      return;
    }

    const newMemory = {
      title,
      mediaUri,
      mediaType,
      timestamp: new Date(),
    };

    ToastAndroid.showWithGravity('Memory saved successfully!', ToastAndroid.SHORT, ToastAndroid.CENTER);
    addMemory(newMemory);
    navigation.navigate('list');
  };

  // Update title and remove warning if title exists
  const handleTitleChange = (value) => {
    setTitle(value);
    if (value) {
      setShowTitleWarning(false);
    }
  };

  // Back handler to navigate back on hardware back press
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  // Function to render selected media based on its type
  const renderMedia = () => {
    if (!mediaUri) return null;

    if (mediaType.startsWith('image/')) {
      return <Image source={{ uri: mediaUri }} style={{ width: '100%', height: 200, marginVertical: 10 }} resizeMode="contain" />;
    }
    if (mediaType.startsWith('video/')) {
      return <Video source={{ uri: mediaUri }} style={{ width: '100%', height: 200, marginVertical: 10 }} resizeMode="contain" controls />;
    }
    if (mediaType.startsWith('audio/')) {
      return (
        <View style={{ backgroundColor: '#ccc', padding: 10, borderRadius: 10, marginBottom: 10, elevation: 2, flexDirection: 'row', alignItems: 'center' }}>
          <Icon name='musical-notes' size={50} />
          <Text style={{ fontWeight: 'bold' }}>Your memory is ready to upload!</Text>
        </View>
      );
    }
    return null;
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
