import { Alert, ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'
import { collection, doc } from 'firebase/firestore'

import { COLORS, SIZES } from '../theme'
import { db } from '../src/firebaseConfig'
import { fetchCollection, fetchData, getData, storeData, removeData } from '../src/handleEvent'
import GameCard from '../components/gameCardLandscape/GameCardLandscape'
import CreateGameModal from '../components/CreateGameModal/CreateGameModal'

const Home = ({route}) => {
    const { uid } = route.params // user uid from firestore auth
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [user, setUser] = useState(null)
    const [categories, setCategories] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [error, setError] = useState(null)
    const navigation = useNavigation()

    const navigateToExplore = () => navigation.navigate("Explore", {uid})

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
       if (user !== null && categories !== null) { 
            setLoading(false)
        }
    }, [user,categories])

    useEffect(() => {
        if (categories === null) {
            getData("letsports-categories-data").then(({data, error}) => {
                (error) ? setError(error) : setCategories(data)
            })
        }
    
        if (user === null) {
            // get user from async storage / firestore
            getData("letsports-user-data").then(({data, error}) => {
                if (error) throw new Error(error) 
                else setUser(data)
            })
            .catch (err => {
                const documentRef = doc(db, 'users', uid)
                fetchData(documentRef).then(({data, error}) => {
                    const obj = {uid: uid, data: data}
                    if (error) {
                        setError(error)
                    } else {
                        storeData("letsports-user-data", obj).then(err => err === null ? undefined: setError(err) )
                        setUser(obj)
                    }
                })
            })
        }
    }, [])

    const onRefresh = () => {
        setRefreshing(true)
        const documentRef = doc(db, 'users', uid)
        fetchData(documentRef).then( async ({data, error}) => {
            const obj = {uid: uid, data: data}
            if (error) {
                setError(error)
            } else {
                await removeData("letsports-user-data").then((err) => {err === null ? undefined: setError(err)} )
                await storeData("letsports-user-data", obj).then(err => err === null ? setRefreshing(false) : setError(err) )
                setUser(obj)
                setRefreshing(false)
            }
        })
      }

    return (
    <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
            <View style={styles.topBarContainer}>
                <Text style={styles.title}>My games</Text>
                <TouchableOpacity style={{marginRight: "2.5%"}} onPress={() => setModalVisible(true)}>
                    <AntDesign name="pluscircle" size={28} color={COLORS.tomato}/>
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
            {
                (!loading) ? ( 
                    ( user["data"]["mygames"].length > 0 ) ? (
                        <FlatList 
                            data={user.data.mygames}
                            renderItem={({ item }) => <GameCard uid={uid} gameID={item}/> }
                            contentContainerStyle={{paddingVertical:"1.25%"}}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        /> 
                    ) : ( 
                        <View style={styles.buttonContainer}>
                            <Text style={{fontSize: SIZES.width* 0.05, textAlign: "center", marginBottom: "7.5%"}}>No joined activity yet...</Text>
                            <TouchableOpacity style={styles.button} onPress={navigateToExplore}>
                                <Text style={styles.buttonText}>Explore now</Text>
                            </TouchableOpacity>
                        </View>
                    )
                ): <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
            }
            </View>

            { modalVisible? <CreateGameModal uid={uid} setModalVisible={setModalVisible}/> : undefined}
        </View>
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: COLORS.offwhite,
        paddingHorizontal: "2.5%",
    },
    topBarContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: "2.5%",
    },
    contentContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: SIZES.width * 0.06,
        marginLeft: "2.5%",
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: "15%",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "tomato",
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: 700,
        fontSize: 16,
    },
})

export default Home