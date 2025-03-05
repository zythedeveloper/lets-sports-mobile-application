import { Alert, ActivityIndicator, View, StyleSheet, LogBox } from 'react-native'
import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import  BottomTabNavigation  from './screens/BottomTabNavigation'
import { collection, doc } from 'firebase/firestore'

import { db } from './src/firebaseConfig'
import { fetchCollection, fetchData, getData, storeData } from './src/handleEvent'
import { registerForPushNotificationsAsync } from './src/handleNotification'
import GameInfo from './components/gameInfo/GameInfo'
import Search from './screens/Search'
import LoginScreen from './screens/Login'
import { COLORS } from './theme'

LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message
LogBox.ignoreAllLogs() //Ignore all log notifications

const Stack = createNativeStackNavigator()

export default function App() {
    const [allGames, setAllGames] = useState(null)
    const [categories, setCategories] = useState(null)
    const [error, setError] = useState(null)

    // Prompt an alert if error occurs
    useEffect(() => {
        if (error && error.status) {
            Alert.alert(
                'Oops, something went wrong!',
                error.message,
                [{ text: 'OK', onPress: () => {} }]
            )
            setError(null)
        }
    }, [error])

     // request the token
     useEffect(() => {
        registerForPushNotificationsAsync()
        .then(token => {
            if (token !== '') storeData("letsports-expoPushToken", token).then(err => err === null ? undefined: setError(err) )
        })
        .catch((error) => setError(error))
    }, [])

    if (categories === null) {
        getData("letsports-categories-data").then(({data, error}) => {
            if (error) throw new Error(error)  
            setCategories(data)
        })
        .catch (err => {
            const collectionRef = collection(db, 'categories')
            fetchCollection(collectionRef).then(({data, error}) => {
                if (error) {
                    setError(error)
                } else {
                    storeData("letsports-categories-data", data).then(err => err === null ? undefined: setError(err) )
                    setCategories(data)
                }
            })
        })
    }

    if (allGames === null) {
        const collectionRef = collection(db, "games")
        fetchCollection(collectionRef, 4).then(({data, error}) => {
            if (error) {
                setError(error)
            } else { 
                storeData("letsports-allgames-data", data).then(err => err === null ? undefined: setError(err) )
                setAllGames(data)
            }
        })
    }

    return ( 
        categories !== null && allGames !== null ? (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}}/>
                    <Stack.Screen name="Bottom Navigation" component={BottomTabNavigation} options={{headerShown: false}} />
                    <Stack.Screen name="GameInfo" component={GameInfo} options={{headerShown: false}} />
                    <Stack.Screen name="Search" component={Search} options={{headerShown: false}} />
                </Stack.Navigator>
            </NavigationContainer> 
        ) : (
            <View style={{
                flex: 1,
                width: "100%",
                justifyContent: "center",
            }}>
                <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
            </View>
        )
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.offwhite,
		alignItems: 'center',
		justifyContent: 'center',
	},
})
