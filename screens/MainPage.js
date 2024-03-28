import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

const expenses = [
    { id: '1', name: 'Bike Rental', description: 'Rented a bike for a day', category: 'Transportation', currency: 'L.', amount: '400' },
    { id: '2', name: 'Jacket Purchase', description: 'Bought a new jacket', category: 'Clothing', currency: 'L.', amount: '500' },
    // ... other expenses
];
const colorList = ['#9EE37D', '#AAEFDF', '#358600', '#63C132'];

const getRandomColor = (() => {
    let index = 0;
    return () => {
        const color = colorList[index % colorList.length];
        index++;
        return color;
    };
})();




/*

// Function to sum expenses by category
const sumExpensesByCategory = (expenses) => {
    const sums = expenses.reduce((acc, { category, amount }) => {
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += parseFloat(amount);
        return acc;
    }, {});

    return Object.keys(sums).map((category) => ({
        name: category,
        amount: sums[category],
        color: getRandomColor(), // You should define this function or choose a color
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
    }));
};
const pieChartData = sumExpensesByCategory(expenses).map(data => ({
    ...data,
    legendFontSize: 10, // Set the font size for legend text here
}));

*/

// Processed data for the pie chart
/*
// Chart configuration
const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};*/

// Screen width for the chart
const screenWidth = Dimensions.get('window').width;

// const ExpenseItem = ({ merchantName, descripcion, fecha, currency, total }) => (
//     <View style={styles.expenseItem}>
//         <View style={styles.expenseInfo}>
//             <Text style={styles.expenseName}>{merchantName}</Text>
//             <Text style={styles.expenseCategory}>{descripcion}</Text>
//             <Text style={styles.expenseDescription}>{fecha}</Text>
//         </View>
//         <View style={styles.expenseAmountContainer}>
//             <Text style={styles.expenseCurrency}>{currency}</Text>
//             <Text style={styles.expenseAmount}>{total}</Text>
//         </View>

//     </View>
// );
const ExpenseItem = ({ merchantName, descripcion, fecha, currency, total, onDelete }) => {
    const handleDelete = () => {
        // Llama a la función onDelete pasada desde el componente padre
        onDelete();
    };

    return (
        <AlertNotificationRoot>
            <View style={styles.expenseItem}>
                <View style={styles.expenseInfo}>
                    <Text style={styles.expenseName}>{merchantName}</Text>
                    <Text style={styles.expenseCategory}>{descripcion}</Text>
                    <Text style={styles.expenseDescription}>{fecha}</Text>
                </View>
                <View style={styles.expenseAmountContainer}>
                    <Text style={styles.expenseCurrency}>{currency}</Text>
                    <Text style={styles.expenseAmount}>{total}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                    handleDelete()
                }} style={styles.deleteButton}>
                    <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </AlertNotificationRoot>

    );
};


const BottomBar = () => (

    <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.profilePicContainer}>
            <Image
                style={styles.profilePic}
                source={{ uri: 'https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png' }} // Replace with your profile picture URL
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}><Icon name="pie-chart" size={30} color="#000" /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconPlus}>+</Text>
        </TouchableOpacity>
    </View>
);

const MainPage = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true); // Add loading state
    const [gastos, setGastos] = useState([]);
    const { userId } = route.params;
    useFocusEffect(
        React.useCallback(() => {
            //Below alert will fire every time when profile screen is focused
            axios.get('https://vanguardia-ocr-831e31b23b4f.herokuapp.com/api/gastos/getGastos/' + userId)
                .then(res => {
                    setGastos(res.data);
                    setLoading(false); // Set loading to false after data is fetched
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false); // Ensure loading is set to false even if there's an error
                });
        }, [])
    );
    useEffect(() => {

    }, []); // Empty dependency array means this runs once on mount


    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                {/* Display a loader or placeholder content here */}
                <Text>Loading...</Text>
            </View>
        );
    }
    const renderHeader = () => (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'< Atrás'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gastos</Text>
                {/* <Text style={styles.headerSubtitle}>Enero 24 2024</Text> */}
            </View>

            <View style={styles.chartContainer}>
                {/*   <PieChart
                    data={pieChartData}
                    width={screenWidth}
                    height={screenWidth * 0.4} // 50% of the screen width
                    chartConfig={chartConfig}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                // Removed the 'absolute' prop
                />*/}
            </View>

            <View style={styles.newExpenseHeader}>
                <Text style={styles.newExpenseHeaderText}>Mis gastos</Text>
                <TouchableOpacity style={styles.newAddButton}
                    onPress={() => {
                        navigation.navigate('DatosManuales', { userId: userId });
                    }}>
                    <Text style={styles.newAddButtonText}>Añadir</Text>
                </TouchableOpacity>
            </View>
        </>
    );


    const handleDeleteItem = (id) => {
        // Filtra los elementos del arreglo gastos para eliminar el elemento con el ID especificado
        const updatedGastos = gastos.filter((item) => item.idgasto !== id);
        setGastos(updatedGastos);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={renderHeader}
                    data={gastos}
                    renderItem={({ item }) => (
                        <ExpenseItem
                            merchantName={item.merchantName}
                            descripcion={item.descripcion}
                            fecha={item.fecha}
                            currency="L. "
                            total={item.total}
                            onDelete={() => handleDeleteItem(item.idgasto)}
                        />
                    )}
                    keyExtractor={(item) => item.idgasto}
                // Remove the flex: 1 from FlatList style if you don't want it to expand
                />
                <View style={styles.bottomBarContainer}>
                    {/* <BottomBar /> */}
                    <View style={styles.bottomBar}>
                        <TouchableOpacity style={styles.profilePicContainer}>
                            <Image
                                style={styles.profilePic}
                                source={{ uri: 'https://e7.pngegg.com/pngimages/753/432/png-clipart-user-profile-2018-in-sight-user-conference-expo-business-default-business-angle-service-thumbnail.png' }} // Replace with your profile picture URL
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Scan', { userId: userId })} style={styles.iconButton}>
                            <MaterialIcons name="camera" size={40} color="white" />{/* <Text style={styles.iconText}><Icon name="pie-chart" size={30} color="#000" /></Text> */}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}
                            onPress={() => {

                            }}>
                            <Text style={styles.iconPlus}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff', // or any color that suits your design
    },
    container: {
        flex: 1, // Make the container fill the screen
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollView: {
        flexGrow: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        backgroundColor: '#358600', // Purple color
        paddingBottom: 16
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center', // Center the pie chart within the container
        marginTop: 20,
        marginBottom: 20, // Add some space below the chart to separate from the list
        // You may want to adjust the height value or make it responsive to the screen size
    },
    backButton: {
        marginBottom: 8,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    }, chartContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtitle: {
        color: '#ffffff',
        fontSize: 14,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 192, // Adjust the height as needed
    },
    expenseHeader: {
        paddingHorizontal: 16,
        paddingTop: 8,
        backgroundColor: '#AAEFDF', // Yellow color
    },
    expenseHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    expenseCategory: {
        fontSize: 14,
        color: '#4b5563', // You can choose a different color
        marginBottom: 4, // Spacing between the category and the description
    },
    addButton: {
        backgroundColor: '#22c55e', // Green color
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    addButtonText: {
        color: '#ffffff',
    },
    expenseDescription: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    expenseCategory: {
        fontSize: 14,
        color: '#4b5563', // Gray color
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#63C132', // Choose a background color for your bottom bar
    }, bottomBarContainer: {
        // This will ensure that the bottom bar stays at the bottom
        justifyContent: 'flex-end',
        marginBottom: 0,
    },
    profilePicContainer: {
        // you can add extra styles if needed
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 20, // half of width/height to make it round
    },
    iconButton: {
        // you can add extra styles if needed
    },
    iconText: {
        // Style for your text inside the icon button, if needed
    },
    iconPlus: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white'
        // you can add extra styles if needed
    },
    newExpenseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F0F0F0', // Adjust the color to match the image provided
        // You might need to add shadow or border styles if they are present in the new design
    },
    newExpenseHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000', // Adjust the color to match the image provided
    },
    newAddButton: {
        backgroundColor: '#FFD700', // Adjust the color to match the image provided
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20, // Adjust to match the rounded corners in the image provided
        // Add shadow or other styling as necessary to match the image provided
    },
    newAddButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000', // Adjust the color to match the image provided
    },
    deleteButton: {
        backgroundColor: 'transparent',
        padding: 5,
        borderRadius: 20,
    },
    ////
    expenseItem: {
        flexDirection: 'column', // Cambiado a 'column'
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#9EE37D',
        borderRadius: 8,
        marginVertical: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '5%'
    },
    expenseInfo: {
        flex: 1,
    },
    expenseName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    expenseCategory: {
        fontSize: 14,
        color: 'gray',
    },
    expenseDescription: {
        fontSize: 14,
    },
    expenseAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseCurrency: {
        fontSize: 20,
    },
    expenseAmount: {
        fontSize: 20,
        marginLeft: 4,
    },
    deleteButton: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        padding: 5,
        marginTop: 10, // Espaciado del botón debajo del contenido
    },

});

export default MainPage;
