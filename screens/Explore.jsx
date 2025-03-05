import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, Text, SafeAreaView, View, TextInput, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons'
import { collection } from 'firebase/firestore'

import { db } from '../src/firebaseConfig'
import { fetchCollection, getData, storeData, removeData } from '../src/handleEvent'
import { COLORS, SIZES } from '../theme'
import GameCard from '../components/gameCardPortrait/GameCardPortrait'
import CategoryCard from '../components/categoryCard/CategoryCard'

const Explore = ({route}) => {
    const { uid } = route.params // user uid from firestore auth
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [allGames, setAllGames] = useState(null)
    const [categories, setCategories] = useState(null)
    const [text, onChangeText] = useState('')
    const [error, setError] = useState(null)

    const navigation = useNavigation()
    const navigateToSearch = () => navigation.navigate("Search", {uid, text})
    
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
        if (allGames !== null && categories !== null) setLoading(false)
     }, [allGames,categories])

    useEffect(() => {
        if (categories === null) {
            getData("letsports-categories-data").then(({data, error}) => {
                (error) ? setError(error) : setCategories(data)
            })
        }
    
        if (allGames === null) {
            getData("letsports-allgames-data").then(({data, error}) => {
                (error) ? setError(error) : setAllGames(data)
            })
        }
    })

    const onRefresh = () => {
        setRefreshing(true)
        const collectionRef = collection(db, "games")
        fetchCollection(collectionRef, 4).then( async ({data, error}) => {
            if (error) {
                setError(error)
            } else {
                await removeData("letsports-allgames-data").then((err) => {err === null ? undefined: setError(err)} )
                await storeData("letsports-allgames-data", data).then(err => err === null ? setRefreshing(false) : setError(err) )
                setAllGames(data)
                setRefreshing(false)
            }
        })
      }

    return ( 
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView 
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text style={styles.title}>Explore</Text>
                <View style={styles.searchBarContainer}>
                    <View style={styles.searchWrapper}>
                        <TextInput 
                            style={styles.searchInput}
                            value={text}
                            onChangeText={onChangeText} 
                            placeholder="Look for your favourite sports here"/>
                    </View>
                    <TouchableOpacity style={styles.searchBtn} onPress={navigateToSearch}>
                        <Feather name="search" size={24} color={COLORS.white}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.findGamesContainer}>
                    <Text style={styles.secondaryTitle}>Latest games</Text>
                    {
                        (!loading) ? 
                        <FlatList 
                            data={Object.keys(allGames)}
                            renderItem={({ item }) => <GameCard uid={uid} gameID={item}/>}
                            keyExtractor={item => item.gameID}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ width: (SIZES.width * 0.55 * (Object.values(allGames).length + .35)) }}
                            windowSize={2}
                        />
                        : <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
                    }
                </View>
                <View style={styles.browseCategoriesContainer}>
                    <Text style={styles.secondaryTitle}>Browse categories</Text>
                    {
                        (categories !== null) ? 
                        <View style={styles.categoryContainer}>
                        {
                            Object.keys(categories).map((sportID) => {
                                const item = categories[sportID]
                                return ( <CategoryCard item={item}/> )
                            })
                        }
                        </View>
                        : <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center"
    },
    container: {
        marginTop: "2.5%",
        marginHorizontal: "2.5%",
    },
    title: {
        fontWeight: "bold",
        fontSize: SIZES.width * 0.06,
        marginLeft: "2.5%",
        marginVertical: "2.5%",
    },
    secondaryTitle: {
        fontSize: SIZES.width * 0.05,
        marginVertical: "2.5%",
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.medium,
        marginBottom: "2.5%",
        marginHorizontal: "2.5%",
        paddingLeft: "5%",
        height: SIZES.height * 0.05,
    },
    searchWrapper: {
        flex: 10,
        backgroundColor: COLORS.secondary,
        marginRight: SIZES.small,
        borderRadius: SIZES.small,
    },
    searchInput: {
        width: "100%",
        height: "100%",
        color: COLORS.gray2,
        fontSize: SIZES.width * 0.035,
    },
    searchBtn: {
        flex: 2,
        borderRadius: SIZES.medium,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.tomato,
        height: SIZES.height * 0.05
    },
    findGamesContainer: {
        width: "100%",
        marginHorizontal: "2.5%",
    },
    browseCategoriesContainer: {
        marginHorizontal: "2.5%",
        paddingBottom: "10%",
    },
    categoryContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: "100%",
    },
})

export default Explore