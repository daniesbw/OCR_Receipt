// App.js
import React from 'react';
import IniciarSesion from './screens/IniciarSesion' // Asegúrate de importar correctamente desde la ruta correcta
import HomeScreen from './screens/HomeScreen';
import  MainPage from './screens/MainPage';
import Scan from './screens/Scan';
import Registrarse from './screens/Registrarse';
import Datos from './screens/DatosManuales';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>

        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} style={styles.container} />
          <Stack.Screen name="IniciarSesion" component={IniciarSesion} />
          <Stack.Screen name="MainPage" component={MainPage} />
          <Stack.Screen name="Scan" component={Scan} />
          <Stack.Screen name="DatosManuales" component={Datos} />

          <Stack.Screen name="Registrarse" component={Registrarse} />
        </Stack.Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f242d',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1f242d',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });




