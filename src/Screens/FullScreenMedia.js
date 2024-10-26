import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Modal, TouchableOpacity, Text, BackHandler } from 'react-native';
import Video from 'react-native-video';

const FullScreenMedia = ({ route, navigation }) => {
  const { mediaUri, mediaType } = route.params;

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

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
