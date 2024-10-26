import React, { useEffect, useState } from 'react';
import { 
  Image, 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  TouchableOpacity, 
  Modal, 
  Button,
  Linking,
  BackHandler,
  ToastAndroid 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MemoryListScreen from './src/Screens/MemoryListScreen';
import MemoryUploadScreen from './src/Screens/MemoryUploadScreen';
import { MemoryProvider } from './src/Context/MemoryContext';
import SplashScreen from './src/Screens/SplashScreen';
import Icon  from 'react-native-vector-icons/FontAwesome';
import FullScreenMedia from './src/Screens/FullScreenMedia';


const Logo = require('./src/Logo.jpg');
const Logotxt = require('./src/Logo_txt1.png');
const pfp = require('./src/creator_pfp.jpg');
const creatorIcon = require('./src/creator.png');

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const Stack = createNativeStackNavigator();
  const [backPressCount, setBackPressCount] = useState(0);

  useEffect(() => {
    const backAction = () => {
      if (backPressCount < 1) {
        ToastAndroid.show('Press again to exit Memorie', ToastAndroid.SHORT);
        setBackPressCount(backPressCount + 1);
        return true; // Prevent default back action
      } else {
        BackHandler.exitApp(); // Exit the app on double back press
        return false;
      }
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, [backPressCount]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <MemoryProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='list'>
          <Stack.Screen 
            name='list' 
            component={MemoryListScreen} 
            options={{
              headerTitleAlign: 'center', 
              headerTitle: () => (
                <View style={{ alignItems: 'center' }}>
                  <Image source={Logotxt} style={{ width: 100, height: 30 }} />
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={creatorIcon} style={{ width: 60, height: 15, left: 30 }} />
                  </TouchableOpacity>
                </View>
              )
            }} 
          />
          <Stack.Screen 
            name='upload' 
            component={MemoryUploadScreen} 
            options={{
              headerTitleAlign: 'center', 
              headerTitle: () => (
                <View>
                  <Image source={require('./src/upload.png')} style={{ width: 120, height: 30 }} />
                </View>
              )
            }} 
          />
          <Stack.Screen name="FullScreenMedia" component={FullScreenMedia} options={{headerTitleAlign:'center',headerTitle:() => (<View>

          </View>)}}/>
        </Stack.Navigator>
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />

        <Modal
         animationType='fade'
         transparent={true}
         visible={modalVisible}
         onRequestClose={() => setModalVisible(false)}>

<View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              
              <Image source={pfp} style={styles.profilePicture} />

              {/* Name and Role */}
              <Text style={styles.name}>Anand Boojesh R S</Text>
              <Text style={styles.role}>Application Developer</Text>

              {/* Social Icons */}
              <View style={styles.socialIcons}>
              <TouchableOpacity onPress={() => Linking.openURL('https://linkedin.com/in/anand-boojesh-r-s')}>
                  <Icon name='linkedin' size={30} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Anand14001')}>
                  <Icon name='github' size={30} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:anand14901@gmail.com')}>
                  <Icon name='envelope' size={30} />
                </TouchableOpacity>
              </View>

              {/* View Profile Button */}
              <TouchableOpacity style={styles.viewProfileButton} onPress={() => Linking.openURL('https://drive.google.com/file/d/13E6kI1FjrBV6jMSiIghK8pAPvggV7Eth/view?usp=sharing')}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>

              </View>
              </View>
        </Modal>
      </NavigationContainer>
    </MemoryProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  coverPhoto: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
    marginBottom: -50, // Overlapping effect
  },
  coverBorder: {
    borderBottomWidth: 5,
    borderBottomColor: '#fff', // White border at the bottom of the cover photo
  },
  profilePicture: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  role: {
    fontSize: 15,
    color: '#666',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 20,
  },
  viewProfileButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#C76E00',
    borderRadius: 5,
  },
  viewProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
