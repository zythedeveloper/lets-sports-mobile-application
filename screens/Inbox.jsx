import { Alert, ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from 'react'
import { doc } from 'firebase/firestore'

import { COLORS, SIZES } from '../theme'
import { getData, storeData, fetchData } from '../src/handleEvent'
import NotificationCard from '../components/NotificationCard'
import { db } from '../src/firebaseConfig'

const Inbox = ({route}) => {
    const { uid } = route.params // user uid from firestore auth
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [notifications, setNotifications] = useState(null)

    // Prompt an alert if error occurs
    useEffect(() => {
        if (error && error.status) {
            Alert.alert(
                'Oops, something went wrong!',
                error.message,
                [{ text: 'OK', onPress: () => {} }]
            );
            setError(null);
        }
    }, [error])

    useEffect(() => {
        if (notifications !== null) setLoading(false)
    }, [notifications])

    useEffect(() => {
        if (notifications === null) {
            getData("letsports-notifications-data").then(({data, error}) => {
                if (error) throw new Error(error)  
                setNotifications(data)
            })
            .catch (err => {
                const documentRef = doc(db, 'inbox', uid)
                fetchData(documentRef).then(({data, error}) => {
                    if (error) {
                        setError(error)
                    } else {
                        storeData("letsports-notifications-data", data.notifications).then(err => err === null ? undefined: setError(err) )
                        setNotifications(data.notifications)
                    }
                })
            })
        }
    }, [])

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Notifications</Text>
                {
                    (!loading) ? 
                    <FlatList
                        data={notifications}
                        renderItem={({ item }) => <NotificationCard notification={item}/> }
                        contentContainerStyle={{margin: "2.5%",}}
                    /> : <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: COLORS.offwhite,
        marginTop: "2.5%",
        marginHorizontal: "2.5%",
    },
    title: {
        fontWeight: "bold",
        fontSize: SIZES.width * 0.06,
        marginLeft: "2.5%",
    },
})

export default Inbox