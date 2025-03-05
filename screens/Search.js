import { SafeAreaView, StyleSheet, TouchableOpacity, Text, TextInput, View, FlatList, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import { collection, doc, query, where } from 'firebase/firestore'

import { db } from '../src/firebaseConfig'
import { fetchCollection, fetchData, getData } from '../src/handleEvent'
import { COLORS, SIZES } from '../theme'
import GameCard from '../components/gameCardLandscape/GameCardLandscape'

const Search = ({navigation, route}) => {
    const { uid } = route.params
    const [loading, setLoading] = useState(true)
    const [text, onChangeText] = useState(route.params.text)
    const [categories, setCategories] = useState(null)
    const [error, setError] = useState(null)
    const [relatedGameID, setRelatedGameID] = useState([])

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
        if (relatedGameID !== null) setLoading(false)
     }, [relatedGameID])

    useEffect(() => {
        if (categories === null) {
            getData("letsports-categories-data").then(({data, error}) => {
                (error) ? setError(error) : setCategories(data)
            })
        }
    }, [])

    const getSportID = (text) => {
        for (const [index, obj] of Object.values(categories).entries()) {
            if (obj.name === text) return Object.keys(categories)[index]
        }
        return -1
    }

    const searchDatabase = (text) => { 
        const sportID = getSportID(text)
        const relatedRef = query(collection(db, "games"), where("category", "==", sportID))
        fetchCollection(relatedRef, 10).then(({data, error}) => {
            (error) ? setError(error) : setRelatedGameID(data)
        })
    }

    if (categories !== null) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topBarContainer}>
                    <View style={styles.searchBarContainer}>
                        <TouchableOpacity style={{marginTop: "1.25%", marginHorizontal: "2.5%"}} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={30} />
                        </TouchableOpacity>
                        <View style={styles.searchWrapper}>
                            <TextInput 
                                style={styles.searchInput}
                                value={text}
                                onChangeText={onChangeText}
                                placeholder="Look for your favourite sports here"/>
                        </View>
                        <TouchableOpacity style={styles.searchBtn} onPress={() => searchDatabase(text) }>
                            <Feather name="search" size={20} color={COLORS.white}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    (!loading) ? 
                    <FlatList 
                        data={Object.keys(relatedGameID)} 
                        renderItem={({ item }) => <GameCard uid={uid} gameID={item}/>}
                    /> : <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
                }
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "2.5%",
        marginHorizontal: "2.5%",
    },
    topBarContainer: {
        flexDirection: "row",
        paddingHorizontal: "2.5%",
        marginVertical: "2.5%",
        justifyContent: "center",
        alignContent:"center",
        alignItems: "flex-start",
        height: SIZES.height * 0.045,
    },
    searchBarContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.small,
        marginBottom: "2.5%",
        paddingLeft: "0%",
    },
    searchWrapper: {
        flex: 10,
        backgroundColor: COLORS.secondary,
        marginRight: SIZES.small,
        borderRadius: SIZES.small,
        height: SIZES.height * 0.045,
        justifyContent: "center",
    },
    searchInput: {
        width: "100%",
        height: "100%",
        color: COLORS.gray2,
        fontSize: SIZES.width * 0.035,
    },
    searchBtn: {
        flex: 2,
        borderRadius: SIZES.small,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.tomato,
    },
    gameCard: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.medium,
        width: "95%",
        height: SIZES.width * 0.35,
        marginBottom: "5%",
        marginHorizontal: "2.5%",
        padding: "2.5%%"
    },
})

export default Search