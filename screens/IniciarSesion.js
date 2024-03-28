import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';


const Example = React.memo(() => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        if (isAuthenticated) {
            navigation.navigate('MainPage');
            setIsAuthenticated(false); // Reset the authentication status
        }
    }, [isAuthenticated, navigation]);
    
    const authenticate = async (email, password, navigation) => {
        try {
            const url = 'https://vanguardia-ocr-831e31b23b4f.herokuapp.com/api/usuarios/authenticateUser'; // Replace with your actual endpoint
    
            const payload = {
                correo: email,
                password: password,
            };
    
            const response = await axios.post(url, payload);
    
            if (response.status === 200) {
                console.log('User authenticated successfully');
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'Autenticado correctamente',
                    textBody: 'Inicio de sesión correctamente. Redirigiendo...',
                });
                const userId = response.data.idUsuario; // Asegúrate de que esto coincida con la estructura de tu respuesta

                // Delay navigation to allow the toast to be visible for a while
                setTimeout(() => {
                    navigation.navigate('MainPage', { userId: userId });
                }, 1500); // Adjust the delay as needed
            } else {
                console.log('Authentication failed');
                Toast.show({
                    type: ALERT_TYPE.ERROR,
                    title: 'Error de autenticación',
                    textBody: 'Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.',
                });
            }
        } catch (error) {
            console.error('Error during authentication:', error.response ? error.response.data : error.message);
            Toast.show({
                type: ALERT_TYPE.ERROR,
                title: 'Error de autenticación',
                textBody: 'Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.',
            });
        }
    };
    

    return (
        <KeyboardAvoidingView style={styles.flexStyle} enabled={true} behavior={"padding"}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                    <AlertNotificationRoot>

                        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.backButton}>
                            <Text style={styles.backButtonText}>{'< Atrás'}</Text>
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Text style={styles.title}>¡Bienvenido de vuelta!</Text>

                            <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={require('../assets/login.png')}
                                    style={styles.image}
                                />
                            </View>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Correo electrónico</Text>

                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    onChangeText={setEmail}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    value={email} />
                            </View>

                            <View style={styles.input}>
                                <Text style={styles.inputLabel}>Contraseña</Text>

                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    onChangeText={setPassword}
                                    placeholder="********"
                                    placeholderTextColor="#6b7280"
                                    style={styles.inputControl}
                                    secureTextEntry={true}
                                />
                                {/* value={password} */}
                            </View>

                            <View style={styles.formAction}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                        authenticate(email, password, navigation); // Pass navigation to the authenticate function

                                    }}>
                                    <View style={styles.btn}>
                                        <Text style={styles.btnText}>Iniciar Sesión</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Registrarse')
                                }}>
                                <Text style={styles.formFooter}>
                                    ¿No tienes una cuenta?{' '}
                                    <Text style={{ textDecorationLine: 'underline' }}>Regístrate</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                        </AlertNotificationRoot>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>

    );
});

// export default function Example() {
//     const navigation = useNavigation();
//     const [form, setForm] = useState({
//         email: '',
//         password: '',
//     });

//     const handlePasswordChange = (password) => {
//         setForm(prevForm => ({ ...prevForm, password }));
//     };

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//             <View style={styles.container}>
//                 <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.backButton}>
//                     <Text style={styles.backButtonText}>{'< Atrás'}</Text>
//                 </TouchableOpacity>
//                 <View style={styles.header}>
//                     <Text style={styles.title}>¡Bienvenido de vuelta!</Text>

//                     <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
//                     <View style={styles.imageContainer}>
//                         <Image
//                             source={require('../assets/login.png')}
//                             style={styles.image}
//                         />
//                     </View>
//                 </View>

//                 <View style={styles.form}>
//                     <View style={styles.input}>
//                         <Text style={styles.inputLabel}>Correo electrónico</Text>

//                         <TextInput
//                             autoCapitalize="none"
//                             autoCorrect={false}
//                             keyboardType="email-address"
//                             onChangeText={email => setForm({ ...form, email })}
//                             placeholder="john@example.com"
//                             placeholderTextColor="#6b7280"
//                             style={styles.inputControl}
//                             value={form.email} />
//                     </View>

//                     <View style={styles.input}>
//                         <Text style={styles.inputLabel}>Contraseña</Text>

//                         <TextInput
//                             autoCorrect={false}
//                             onChangeText= {handlePasswordChange}//{password => setForm({ ...form, password })}
//                             placeholder="********"
//                             placeholderTextColor="#6b7280"
//                             style={styles.inputControl}
//                             secureTextEntry={true}
//                             value={form.password} />
//                     </View>

//                     <View style={styles.formAction}>
//                         <TouchableOpacity
//                             onPress={() => {
//                                 // handle onPress
//                             }}>
//                             <View style={styles.btn}>
//                                 <Text style={styles.btnText}>Iniciar Sesión</Text>
//                             </View>
//                         </TouchableOpacity>
//                     </View>

//                     <TouchableOpacity
//                         onPress={() => {
//                             navigation.navigate('Registrarse')
//                         }}>
//                         <Text style={styles.formFooter}>
//                             ¿No tienes una cuenta?{' '}
//                             <Text style={{ textDecorationLine: 'underline' }}>Regístrate</Text>
//                         </Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// }

const styles = StyleSheet.create({
    flexStyle: {
        flex: 1
    },
    container: {
        padding: 24,

        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    header: {
        marginVertical: 36,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1d1d1d',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292',
        textAlign: 'center',
    },
    /** Form */
    form: {
        marginBottom: 24,
    },
    formAction: {
        marginVertical: 24,
    },
    formFooter: {
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        textAlign: 'center',
    },
    /** Input */
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputControl: {
        height: 44,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        height: 45,
        backgroundColor: '#80c494',
        borderColor: '#80c494',//'#007aff',
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: -20,
    },
    imageContainer: {
        alignItems: 'center', // Centra la imagen horizontalmente
        justifyContent: 'center', // Centra la imagen verticalmente
        marginTop: 10, // Espacio superior opcional
    },
    btnText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#fff',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#80c494'//'#007aff',
    },
});

export default Example;