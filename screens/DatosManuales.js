import React, { useState, useEffect } from 'react';
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
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DatosM = React.memo(({ route, navigation }) => {
    const { userId, responseString } = route.params;
    const [isLoading, setIsLoading] = useState(true); // Initially, the component is loading

    const [items, setItems] = useState([]);
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [NameLocal, setNameLocal] = useState('');
    const [PrecioTotal, setPrecioTotal] = useState('');
    const [DescripcionGeneral, setDescriptionGeneral] = useState('');

    const [Fecha, setFecha] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [quantity2, setQuantity2] = useState('');

    const handleQuantityChange = (text) => {
        // Verificar si el texto ingresado es un número entero válido
        const isValid = /^\d+$/.test(text);

        // Verificar si el texto contiene un punto decimal
        const containsDecimal = /\./.test(text);

        // Si es válido y no contiene punto decimal, actualizar el estado de la cantidad
        if ((isValid && !containsDecimal) || text === '') {
            setQuantity2(text);
        }
    };

    useEffect(() => {
        if (responseString) {
            try {
                const responseData = JSON.parse(responseString);
                if (responseData && responseData.length > 0) {
                    setNameLocal(responseData[0].MerchantName);
                    setPrecioTotal(responseData[0].TotalPrice.toString());
                    setFecha(responseData[0].TransactionDate);
                }
                const newItems = responseData[0].Items.map(item => ({
                    description: item.Description,
                    quantity: item.Quantity.toString(),
                    price: item.Price.toString(),
                    totalPrice: item.TotalPrice.toString()
                }));

                let descriptions = '';

                const newItems2 = responseData[0].Items.map(item => {
                    // Ensure item.Description is not null before appending to descriptions string
                    descriptions += item.Description ? item.Description + ', ' : '';

                    // Ensure Quantity, Price, and TotalPrice are not null before calling toString()
                    return {
                        description: item.Description || '',
                        quantity: item.Quantity ? item.Quantity.toString() : '0',
                        price: item.Price ? item.Price.toString() : '0',
                        totalPrice: item.TotalPrice ? item.TotalPrice.toString() : '0'
                    };
                });

                // Remove the last comma and space from the descriptions string
                descriptions = descriptions.replace(/, $/, '');
                setDescriptionGeneral(descriptions);
                setItems(newItems);
            } catch (error) {
                console.error("Error parsing responseString:", error);
            }
        }
        setIsLoading(false); // Set loading to false once operations are completed

    }, [responseString]); // Only re-run the effect if responseString changes

    const addItem = () => {
        // Create a new item object
        const newItem = {
            description: description,
            quantity: quantity,
            price: price,
            totalPrice: parseFloat(quantity) * parseFloat(price) // Calculate total price for this item
        };
        // Add the new item to the list of items
        setItems([...items, newItem]);
        // Clear input fields
        setDescription('');
        setQuantity('');
        setPrice('');
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const finalizeReceipt = async () => {
        // Construct the receipt object
        console.log("Receipt finalized:" + userId);
        const receipt = {
            idUsuario: userId,
            descripcion: DescripcionGeneral,
            total: PrecioTotal,
            fecha: Fecha,
            merchantName: NameLocal,
        };
        //axios post request
        try {
            const response = await axios.post('https://vanguardia-ocr-831e31b23b4f.herokuapp.com/api/gastos/insertGasto', receipt)
            const idGasto = await axios.get('https://vanguardia-ocr-831e31b23b4f.herokuapp.com/api/gastos/getGastoId/' + userId)
            console.log("idgasto: " + JSON.stringify(idGasto.data, null, 2));
            if (items.length > 0) {
                for (let i = 0; i < items.length; i++) {
                    const item = {
                        idGasto: parseInt(idGasto.data.idgasto),
                        idUsuario: userId,
                        cantidad: parseInt(items[i].quantity, 10),
                        descripcion: items[i].description,
                        precio: items[i].price,
                        total: parseInt(items[i].quantity, 10) * parseInt(items[i].price, 10)
                    }
                    const response = await axios.post('https://vanguardia-ocr-831e31b23b4f.herokuapp.com/api/gastos/insertGastoDetalle', item)
                }
            }

            // Toast.show({
            //     type: 'success',
            //     position: 'top',
            //     text1: 'Factura agregada',
            //     visibilityTime: 2000,
            //     autoHide: true,
            //     topOffset: 30,
            //     bottomOffset: 40,
            // });
        } catch (e) {
            console.log(e)
        }




        // Perform any necessary action with the receipt object (e.g., save to database)
        console.log("Receipt finalized:", receipt);
        Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: '¡Factura agregada!',
            button: 'Cerrar',
            // Temporarily comment out the navigation action
             onPress: () => navigation.navigate('DatosManuales')
        });
        // Clear the inputs and items array for next receipt
        setNameLocal('');
        setFecha('');
        setReceiptNumber('');
        setPrecioTotal('');
        setDescriptionGeneral('');
        setItems([]);
    };

    return (
        <KeyboardAvoidingView style={styles.flexStyle} enabled={true} behavior={"padding"}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                {isLoading ? (
                    // Render a loading indicator when the component is loading
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        <View style={styles.container}>
                            <TouchableOpacity onPress={() => navigation.navigate('MainPage', { userId: userId })} style={styles.backButton}>
                                <Text style={styles.backButtonText}>{'< Atrás'}</Text>
                            </TouchableOpacity>
                            <View style={styles.header}>
                                <Text style={styles.title}>¡Ingrese los datos!</Text>
                            </View>

                            <View style={styles.form}>
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Nombre del local/negocio</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="default"
                                        onChangeText={setNameLocal}
                                        placeholder={NameLocal ? "" : "El titan"} // Conditional placeholder
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        value={NameLocal}
                                    />
                                </View>

                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Precio Total</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="default"
                                        onChangeText={setPrecioTotal}
                                        placeholder="L. 12500.00"
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        value={PrecioTotal}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Descripcion</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="default"
                                        onChangeText={setDescriptionGeneral}
                                        placeholder="Compra de 2 camisetas de futbol"
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        value={DescripcionGeneral}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <Text style={styles.inputLabel}>Fecha</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="default"
                                        onChangeText={setFecha}
                                        placeholder="13 de marzo del 2024"
                                        placeholderTextColor="#6b7280"
                                        style={styles.inputControl}
                                        value={Fecha}
                                    />
                                </View>

                                <View style={styles.container2}>
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.inputLabel, { marginTop: 5, marginBottom: 10 }]}>Producto</Text>
                                        <View style={styles.input}>
                                            <TextInput
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType="default"
                                                placeholderTextColor="#6b7280"
                                                style={[styles.inputControl]}
                                                value={description}
                                                onChangeText={setDescription}
                                                placeholder="Descripcion del producto"
                                            />
                                        </View>
                                        <View style={styles.input}>
                                            <TextInput
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType="numeric"
                                                placeholderTextColor="#6b7280"
                                                style={[styles.inputControl]}
                                                value={quantity}
                                                onChangeText={setQuantity}
                                                // onChangeText={handleQuantityChange}
                                                placeholder="Cantidad"
                                                returnKeyType="done"
                                            />
                                        </View>
                                        <View style={styles.input}>
                                            <TextInput
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType="numeric"
                                                placeholderTextColor="#6b7280"
                                                style={[styles.inputControl]}
                                                value={price}
                                                onChangeText={setPrice}
                                                placeholder="Precio por unidad"
                                                returnKeyType="done"
                                            />
                                        </View>
                                        <TouchableOpacity onPress={addItem} style={styles.btnAdd}>
                                            <Text style={styles.btnText}>Añadir producto</Text>
                                        </TouchableOpacity>
                                        {/* <View style={styles.productInputContainer}>
                                        <View style={styles.productInput}>
                                            <TextInput
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType="default"
                                                placeholderTextColor="#6b7280"
                                                style={[styles.inputControl]}
                                                value={description}
                                                onChangeText={setDescription}
                                                placeholder="Descripcion del producto"
                                            />
                                            <TextInput
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType="default"
                                                placeholderTextColor="#6b7280"
                                                style={[styles.inputControl]}
                                                value={quantity}
                                                onChangeText={setQuantity}
                                                placeholder="Cantidad"
                                            />
                                            <TextInput
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType="default"
                                                placeholderTextColor="#6b7280"
                                                style={[styles.inputControl]}
                                                value={price}
                                                onChangeText={setPrice}
                                                placeholder="Precio por unidad"
                                            />
                                        </View>
                                        <TouchableOpacity onPress={addItem} style={styles.btnAdd}>
                                            <Text style={styles.btnText}>Añadir producto</Text>
                                        </TouchableOpacity>
                                    </View> */}

                                    </View>
                                </View>

                                {/* Display the list of added items */}
                                <Text style={styles.inputLabelPA}>Productos Agregados:</Text>
                                {items.map((item, index) => (
                                    <View key={index} style={styles.itemContainer}>
                                        <Text style={styles.itemText}>Descripción: {item.description}</Text>
                                        <Text style={styles.itemText}>Cantidad: {item.quantity}</Text>
                                        <Text style={styles.itemText}>Precio: {item.price}</Text>
                                        <Text style={styles.itemText}>Precio Total: {item.totalPrice}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteItem(index)} style={styles.deleteButton}>
                                            <Ionicons name="trash-bin" size={24} color="white" />
                                        </TouchableOpacity>
                                    </View>

                                ))}

                                <TouchableOpacity onPress={finalizeReceipt} style={styles.btnFinalize}>
                                    <Text style={styles.btnText}>Añadir Factura</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>

    );
});

const styles = StyleSheet.create({
    productInputContainer: {
        // flexDirection: 'row',
        marginBottom: 10,
        // justifyContent: 'space-evenly',
    },
    productInput: {
        width: 210,
    },
    btnAdd: {
        marginTop: 10,
        // marginLeft: 'auto', // Aligns the button to the right
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#FFD700',
        height: 60,
        marginBottom: 15
    },
    btnFinalize: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#80c494',
    },
    itemContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
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
    form: {
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    inputLabelPA: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
        marginTop: 25
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
    container2: {
        // marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff', // Color de fondo del contenedor
    },
    inputContainer: {
        padding: 20,
        paddingBottom: 10
    },
    /** Button */
    btn: {
        flexDirection: 'column',
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
    deleteButton: {
        backgroundColor: 'red',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        alignSelf: 'center', // Centra horizontalmente el botón dentro del contenedor
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DatosM;