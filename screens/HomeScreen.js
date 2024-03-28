import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainerHS}>
      <Text style={styles.textMainHS}>Financy</Text>
      <Image
        source={require('../assets/welcome.gif')}
        style={styles.image}
      />
      <TouchableOpacity
        style={styles.buttonIniciarSesionHS}
        onPress={() => navigation.navigate('IniciarSesion')}
      >
        <Text style={styles.buttonTextIniciarSesionHS}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonRegistrarseHS}
        onPress={() => navigation.navigate('Registrarse')}
      >
        <Text style={styles.buttonTextRegistrarseHS}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window'); // Obtener el ancho de la pantalla

const styles = StyleSheet.create({
  mainContainerHS: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f242d', //bk
  },
  textMainHS: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 60,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  buttonIniciarSesionHS: {
    backgroundColor: '#80c494',
    borderRadius: 20,
    width: width * 0.8, // Ancho del 80% de la pantalla
    height: 60, // Ajusta la altura según tu preferencia
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonTextIniciarSesionHS: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRegistrarseHS: {
    backgroundColor: '#FFA500', //#FFA500
    borderRadius: 20,
    width: width * 0.8, // Ancho del 80% de la pantalla
    height: 60, // Ajusta la altura según tu preferenciaaa
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextRegistrarseHS: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
