import { Alert, ActivityIndicator, TouchableOpacity, Text, View, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { doc, collection } from 'firebase/firestore'

import styles from './gameCardLandscape.style'
import { db } from '../../src/firebaseConfig'
import { fetchCollection, fetchData, getData } from '../../src/handleEvent'

const GameCard = ({uid, gameID}) => {
    const [hostedBy, setHostedBy] = useState(null)
    const [item, setItem] = useState(null)
    const [categories, setCategories] = useState(null)
    const [error, setError] = useState(null)

    const navigation = useNavigation()
    const navigateToInfo = (gameID) => navigation.navigate("GameInfo", {uid, gameID})

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
        if (item === null) {
            getData("letsports-allgames-data").then(({data, error}) => {
                (error && error.status) ? setError(error) : setItem(data[gameID])
            })
            .catch (err => {
                const gameRef = doc(db, 'games', gameID)
                fetchData(gameRef).then(({data, error}) => {
                    (error && error.status) ? setError(error) : setItem(data)
                })
            })
        } 
    
        if (categories === null) {
            getData("letsports-categories-data").then(({data, error}) => {
                (error && error.status) ? setError(error) : setCategories(data)
            })
        }
    }, []) 
    
    useEffect(() => {
        if ( item !== null && hostedBy === null) {
            const hostRef = doc(db, 'users', item.hostedBy)
            fetchData(hostRef).then(({data, error}) => {
                (error && error.status) ? setError(error) : setHostedBy(data.name)
            })
        }
    }, [item])

    if (item !== null && hostedBy !== null && categories !== null) 
    {
        const { venue } = item.location
        const { first, last } = hostedBy

        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.gameCard, styles.shadowProp]} onPress={() => navigateToInfo(gameID)}>
                    <Image style={styles.image} src={categories[item.category].uri} />
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{categories[item.category].name}</Text>
                        <Text style={styles.text}>{`${last} ${first}`}</Text>
                        <Text style={styles.text}>{`${venue}`}</Text>
                        <Text style={styles.text}>Wed, 31 July</Text>
                        <Text style={styles.text}>{item.gameLevel}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export default GameCard