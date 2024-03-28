import React, { useState } from 'react';
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

export default function Registrarse() {
    const navigation = useNavigation();
    const [form, setForm] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const registerUser = async (userData) => {
        try {
            const url = 'https://vanguardia-ocr-831e31b23b4f.herokuapp.com/api/usuarios/createUser';

            // Include confirmPassword in the destructuring
            const { name, lastName, email, password, confirmPassword } = userData;

            // Validate fields are not empty
            if (!name || !lastName || !email || !password || !confirmPassword) {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Validation Error',
                    textBody: 'Please fill in all the fields.',
                });
                return; // Exit the function if validation fails
            }

            // Additional validation: Check if passwords match
            if (password !== confirmPassword) {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Validation Error',
                    textBody: 'Passwords do not match.',
                });
                return; // Exit the function if passwords don't match
            }

            const payload = {
                nombre: name,
                apellido: lastName,
                correo: email,
                password: password,
            };

            const response = await axios.post(url, payload);

            setForm({
                name: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            });

          
            console.log('User registered:', response.data);
        } catch (error) {
            console.error('Error registering user:', error.response ? error.response.data : error.message);
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
                                <Text style={styles.title}>¡Regístrate!</Text>

                                <Text style={styles.subtitle}>Crea tu cuenta</Text>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={require('../assets/signup.png')}
                                        style={styles.image}
                                    />
                                </View>
                            </View>

                            <View style={styles.form}>
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Nombre</Text>
                                    <TextInput
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                        onChangeText={name => setForm({ ...form, name })}
                                        placeholder="John"
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        value={form.name} />
                                </View>

                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Apellido</Text>
                                    <TextInput
                                        autoCapitalize="words"
                                        autoCorrect={false}
                                        onChangeText={lastName => setForm({ ...form, lastName })}
                                        placeholder="Doe"
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        value={form.lastName} />
                                </View>




                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Correo electrónico</Text>

                                    <TextInput
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="email-address"
                                        onChangeText={email => setForm({ ...form, email })}
                                        placeholder="john@example.com"
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        value={form.email} />
                                </View>

                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Contraseña</Text>

                                    <TextInput
                                        autoCorrect={false}
                                        onChangeText={password => setForm({ ...form, password })}
                                        placeholder="********"
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        secureTextEntry={true}
                                        value={form.password} />
                                </View>

                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Confirmar Contraseña</Text>

                                    <TextInput
                                        autoCorrect={false}
                                        onChangeText={confirmPassword => setForm({ ...form, confirmPassword })}
                                        placeholder="********"
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        secureTextEntry={true}
                                        value={form.confirmPassword} />
                                </View>

                                <View style={styles.formAction}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            registerUser(form);
                                            Dialog.show({
                                                type: ALERT_TYPE.SUCCESS,
                                                title: 'Success',
                                                textBody: '¡Usuario creado correctamente!',
                                                button: 'Iniciar Sesión',
                                                // Temporarily comment out the navigation action
                                                 onPress: () => navigation.navigate('IniciarSesion')
                                            });
                                        }}
                                    >
                                        <View style={styles.btn}>
                                            <Text style={styles.btnText}>Crear Cuenta</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('IniciarSesion')
                                    }}>
                                    <Text style={styles.formFooter}>
                                        ¿Ya tienes una cuenta?{' '}
                                        <Text style={{ textDecorationLine: 'underline' }}>Inicia sesión</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </AlertNotificationRoot>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView >
    );
}

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