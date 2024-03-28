import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons
import firebase from './firebase.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const storage = getStorage(firebase); // firebaseApp is your initialized Firebase app
import axios from 'axios';





export default function CameraComponent({ route, navigation }) {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [previewVisible, setPreviewVisible] = useState(false);
    const { userId } = route.params;
    const [isLoading, setIsLoading] = useState(false);




    const [imageRef, setImageRef] = useState(null); // Add this line to initialize imageRef state

    const uploadImageAndGetURL = async (uri) => {

        try {
            const response = await fetch(uri);
            const blob = await response.blob();

            // Create a reference to the full path of the image in your Firebase Storage
            const imagePath = `images/${new Date().toISOString()}-yourImageName.jpg`; // Using a timestamp to ensure uniqueness
            const newImageRef = ref(storage, imagePath);
            setImageRef(newImageRef); // Update imageRef state for later use

            console.log('Uploading image to Firebase Storage:', uri);

            // Upload the blob to Firebase Storage using newImageRef
            await uploadBytes(newImageRef, blob);

            console.log('Image uploaded successfully:', imagePath);

            // Get the download URL using newImageRef
            const downloadURL = await getDownloadURL(newImageRef);
            console.log('Image download URL:', downloadURL);

            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };






    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');

            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            if (audioStatus.status !== 'granted') {
                alert('Sorry, we need microphone permissions to make this work!');
            }
        };

        requestPermissions();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
            setPreviewVisible(true);
        }
    };

    const retakePicture = () => {
        setImage(null);
        setPreviewVisible(false);
    };
    const goBack = () => {
        // Here you can handle the navigation or simply close the camera view
        navigation.navigate('MainPage', { userId: userId });
    };


    const confirmPicture = async () => {
        setIsLoading(true); // Start loading

        console.log('Picture added:', image);
        const downloadURL = await uploadImageAndGetURL(image);
        if (downloadURL) {
            console.log('Sending image URL:', downloadURL);
            try {
                const response = await axios.post('https://ocrhighresvanguardia.azurewebsites.net/api/ocrreceipt', {
                    url: downloadURL,
                });
                setIsLoading(false); // Start loading

                const responseString = JSON.stringify(response.data, null, 2); // Pretty print the object
                if (imageRef) {
                    await deleteObject(imageRef); // Ensure imageRef is not null
                    setImageRef(null); // Reset imageRef state if needed
                }
                
                navigation.navigate('DatosManuales', { userId: userId, responseString: responseString });

            } catch (error) {
                console.error('Error sending image URL:', error.response?.data || error.message);
                // Handle error...
            }
        } else {
            console.error('Error uploading image:', image);
        }

        // Reset state...
    };

    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    // Inside your component's return statement
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (previewVisible) {
        return (
            <View style={{ flex: 1, backgroundColor: "#22c55e" }}>
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Image source={{ uri: image }} style={{ flex: 1 }} />
                {/* <View style={styles.previewButtons}>
                    <Button title="Retake" onPress={retakePicture} color="#fff" />
                    <Button title="Add" onPress={confirmPicture} color="#fff"/>
                </View> */}
                <View style={styles.previewButtons}>
                    <TouchableOpacity style={styles.buttonRA} onPress={retakePicture}>
                        <Text style={styles.buttonTextRA}>Retake</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRA} onPress={confirmPicture}>
                        <Text style={styles.buttonTextRA}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.cameraContainer}>
                <View style={styles.topBar}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fullscreen}
                    type={type}
                    ratio={'16:9'} />
                <View style={styles.cameraUI}>
                    <TouchableOpacity
                        style={styles.flipButton}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <MaterialIcons name="flip-camera-ios" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                        <MaterialIcons name="camera" size={60} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#22c55e', // The green background
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: "#22c55e",
        // flexDirection: 'row' // Remove or change to 'column' if needed
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'absolute',
        top: StatusBar.currentHeight || 0, // Use the status bar height to position the topBar below the status bar
        left: 0,
        right: 0,
        zIndex: 10,
        // ... other styling for topBar
    },
    backButton: {
        padding: 10,
        marginLeft: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: add background color for the button for visibility
        borderRadius: 30, // Optional: round the corners of the button
    },
    fullscreen: {
        width: '100%', // Full width
        height: '87%', // Full height
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: "#22c55e",
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 16 / 9 // Updated aspectRatio to 16:9
    },

    cameraUI: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black background
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 20,
    },
    flipButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    captureButton: {

        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 50,
    },
    instructionText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
    },
    previewButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black background
    },
    buttonRA: {
        backgroundColor: '#007bff', // Color del botón
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonTextRA: {
        color: '#fff', // Color del texto del botón
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // White background
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 20,
        elevation: 2, // Shadow for Android
        shadowColor: '#000000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#000000', // Black text color
        fontWeight: 'bold',
        fontSize: 16,
    },
});
