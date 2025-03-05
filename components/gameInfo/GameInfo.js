import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useState, useEffect } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { doc } from 'firebase/firestore'

import { COLORS, SIZES } from '../../theme'
import styles from './gameInfo.style'
import { db } from '../../src/firebaseConfig'
import { updateMyGames, updateJoinedBy, fetchData, getData } from '../../src/handleEvent'

const GameInfo = ({ navigation, route }) => {
    const { uid, gameID } = route.params
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [item, setItem] = useState(null)
    const [hostedBy, setHostedBy] = useState(null)
    const [categories, setCategories] = useState(null)
    const [isJoined, setIsJoined] = useState(false)
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

    useEffect(() => {
        if (user === null) {
            getData("letsports-user-data").then(({data, error}) => {
                if (error) throw new Error(error)
                else setUser(data)
                console.log("GameInfo: setUser")
            }).catch(err => {
                navigation.navigate("Login")
            })
        }
    
        if (item === null) {
            const gameRef = doc(db, 'games', gameID)
            fetchData(gameRef).then(({data, error}) => {
                (error && error.status) ? setError(error) : setItem(data)
                console.log("GameInfo: setItem")
            })
        } 
    
        if (categories === null) {
            getData("letsports-categories-data").then(({data, error}) => {
                (error) ? setError(error) : setCategories(data)
                console.log("GameInfo: setCategories")
            })
        }
    }, [])

    useEffect(() => {
        if ( item !== null && hostedBy === null) {
            const hostRef = doc(db, 'users', item.hostedBy)
            fetchData(hostRef).then(({data, error}) => {
                (error && error.status) ? setError(error) : setHostedBy(data.name)
                console.log("GameInfo: setHostedBy")
                setLoading(false)
            })
        }
    }, [item])

    // Check if the user has already joined the game
    useEffect(() => {
        if (item && user) {
            const joined = item.joinedBy.includes(user.uid)
            setIsJoined(joined);
            console.log("GameInfo-isJoined:", joined)
        }
    }, [item, user])

    const handleJoin = async () => {
        try {
            setLoading(true)
            let documentRef = doc(db, "users", uid)
            await updateMyGames(documentRef, gameID).then(async (error) => { 
                if (error && error.status) {
                    setError(error) 
                } else {
                    documentRef = doc(db, "games", gameID)
                    await updateJoinedBy(documentRef, uid).then(error => { (error && error.status) ? setError(error) : setIsJoined(true)})
                }
            })
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const FooterComponents = () => { return (
        <View style={styles.footer}>
            <View style={styles.priceWrapper}> 
                <Text style={styles.price}>{`$ ${item.entryFees}`}</Text>
                <Text style={{lineHeight: SIZES.width * 0.1}}>/pax</Text>
            </View>
            <TouchableOpacity style={styles.btnJoin} onPress={handleJoin}>
                <Text style={styles.btnText}>Join</Text>
            </TouchableOpacity>
        </View>
    )}
    
    if (!loading) {
        const { first, middle, last } = hostedBy
        const { venue, city } = item.location

        return (
            <View style={styles.container}>
                <View style={styles.topTabNavigation}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-circle" size={30} />
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <Image style={styles.coverImage} src={categories[item.category].uri}/>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{categories[item.category].name}</Text>
                        <View style={styles.details}>
                            <AntDesign name="user" size={18} color="black" />
                            <Text style={styles.text}>{middle ? `${last} ${middle} ${first}` : `${last} ${first}`}</Text>
                        </View>
                        <View style={styles.details}>
                            <Ionicons name="location-outline" size={18} color="black" />
                            <Text style={styles.text}>{`${venue}`}</Text>
                        </View>
                        <View style={styles.details}>
                            <AntDesign name="clockcircleo" size={18} color="black" />
                            <Text style={styles.text}>Time</Text>
                        </View>
                        <View style={styles.details}>
                            <AntDesign name="infocirlceo" size={18} color="black" />
                            <Text style={styles.text}>{`${item.gameLevel}`}</Text>
                        </View>
                        <View>
                            <Text style={styles.descriptionTitle}>Description</Text>
                            <Text style={styles.descriptionText}>{item.description}</Text>
                        </View>
                    </View>
                </ScrollView>
                {
                    (!isJoined) ? <FooterComponents/> : undefined
                }
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.topTabNavigation}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-circle" size={30} />
                    </TouchableOpacity>
                </View>
                <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
            </View>
        )
    }
}

export default GameInfo