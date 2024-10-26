// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text, StatusBar } from 'react-native';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer); // Clean up the timer
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#ffff'} barStyle={'dark-content'}/>
      <Image source={require('../Logo_txt1.png')} style={styles.logo1} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffff',
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    margin:10
  },
  logo1: {
    width: 240, // Adjust the width as needed
    height: 110, // Adjust the height as needed
  },
  Title:{
    fontWeight:'bold',
    fontSize:30,
    textAlign:'center',
    color:'#000'
  }
});

export default SplashScreen;
