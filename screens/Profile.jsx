import { Alert, StyleSheet, TouchableOpacity, Text, SafeAreaView, View } from 'react-native'
import { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native"
import { FontAwesome, Ionicons } from '@expo/vector-icons'

import { SIZES, COLORS } from '../theme'
import { getData, SignOut } from "../src/handleEvent"

const Profile = ({ route }) => {
    const { uid } = route.params // user uid from firestore auth
    const [user, setUser] = useState(null)
    const [categories, setCategories] = useState(null)
    const [error, setError] = useState(null)

    const navigation = useNavigation()
    const navigateToLogin = () => navigation.navigate("Login")

    const handleSignOut = async () => {
        const err = await SignOut()
        if (err && err.status) setError(err)
        else navigateToLogin()
    }

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
        if (user === null) {
            getData("letsports-user-data").then(({data, error}) => {
                (error) ? setError(error) : setUser(data)
            })
        } 
    
        if (categories === null) {
            getData("letsports-categories-data").then(({data, error}) => {
                (error) ? setError(error) : setCategories(data)
            })
        }
    }, [])
    
    if (user !== null && categories !== null) { 
        const {first, middle, last} = user.data.name
        const {city, state, country} = user.data.location
        return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.userContainer}>
                    <FontAwesome name="user-circle-o" size={75} color="black" />
                    <View style={{marginLeft: "5%"}}>
                        <Text style={styles.title}>{(middle) ? `${last} ${middle} ${first}`: `${last} ${first}`}</Text>
                        <View style={{flexDirection:"row"}}>
                            <Ionicons name="location-outline" size={18} color="black" />
                            <Text style={styles.text}>{(state) ? `${city}, ${state}, ${country}` : `${city}, ${country}`}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.aboutContainer}>
                    <Text style={styles.title}>About me</Text>
                    <Text style={styles.text}>{user.data.bio}</Text>
                </View>
                <View>
                    <Text style={styles.title}>Interests</Text>
                    <View style={styles.interestContentContainer}>
                        {
                            ( user.data.interests !== null) ? user.data.interests.map((id) => 
                               <View style={styles.interestTextContainer}>
                                    <Text style={styles.interestText}>{categories[id].name}</Text>
                               </View>
                            ) 
                            : <Text>No data</Text>
                        }
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )}
}

const styles = StyleSheet.create({ 
    safeContainer: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingVertical: "2.5%",
        paddingHorizontal: "5%",
        backgroundColor: COLORS.offwhite,
    },
    userContainer: {
        flexDirection:"row",
        alignItems: "center",
        marginVertical: "1.25%",
    },
    aboutContainer: {
        marginVertical: "1.25%",
    },
    title: {
        fontWeight: "bold",
        fontSize: SIZES.width * 0.06,
        marginVertical: "2.5%",
    },
    text:{
        marginLeft: "2.5%",
        textAlign: "left",
        fontSize: SIZES.width * 0.035,
    },
    interestContentContainer: {
        flexDirection: "row",
        marginLeft: "1.25%",
    },
    interestTextContainer: {
        backgroundColor: COLORS.gray,
        borderWidth: 1,
        borderStyle: "dashed",
        padding: "1.25%",
        marginHorizontal: "1.25%",
    },
    interestText: {
        textAlign: "left",
        fontSize: SIZES.width * 0.035,
    },
    details: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "flex-start",
        marginVertical: "2.5%",
    },
    descriptionTitle: {
        fontSize: SIZES.width * 0.05,
        marginVertical: "5%",
    },
    descriptionText:{
        textAlign: "justify",
        fontSize: SIZES.width * 0.035,
    },
    buttonContainer: {
        width: "100%",
        paddingHorizontal: "15%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
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

export default Profile