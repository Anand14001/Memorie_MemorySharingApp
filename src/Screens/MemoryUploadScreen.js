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
  const [title, setTitle] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [showTitleWarning, setShowTitleWarning] = useState(false);
  let actionSheetRef = React.createRef();

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]);
      return granted;
    } catch (err) {
      Alert.alert('Permission error', 'Could not get permissions');
      return false;
    }
  };

  const selectMedia1 = async () => {
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) {
      return;
    }

    try {
      const response = await launchImageLibrary({
        mediaType: 'mixed', // Use 'photo' or 'video' for specific types
        selectionLimit: 1, // Limit selection to one item
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

  const showMediaOptions = () => {
    Alert.alert(
      "Select Media",
      "Choose an option",
      [
        {
          text: "Image/Video",
          onPress: () => selectMedia1(), // Proceed with image selection
        },
        
        {
          text: "Audio",
          onPress: () => selectMedia(), // Proceed with audio selection
        },
        {
          text: "Cancel",
          style: "cancel",
        }
      ],
      { cancelable: true }
    );
  };

  const captureMemory = () => {
    actionSheetRef.current.show();
  };

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
            setShowTitleWarning(true); // Show warning if title is missing
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
            setShowTitleWarning(true); // Show warning if title is missing
          }
        }
      });
    } else if (index === 2) {
      console.log('Record Audio');
      // Implement audio recording logic
    }
  };

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

  const handleTitleChange = (value) => {
    setTitle(value);
    if (value) {
      setShowTitleWarning(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  // Function to render media based on type
  const renderMedia = () => {
    if (!mediaUri) return null;

    if (mediaType.startsWith('image/')) {
      return (
        <Image
          source={{ uri: mediaUri }}
          style={{ width: '100%', height: 200, marginVertical: 10 }}
          resizeMode="contain"
        />
      );
    }

    if (mediaType.startsWith('video/')) {
      return (
        <Video
          source={{ uri: mediaUri }}
          style={{ width: '100%', height: 200, marginVertical: 10 }}
          resizeMode="contain"
          controls
        />
      );
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
