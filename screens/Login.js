import { Alert, StyleSheet, SafeAreaView, View, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Modal } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useState, useEffect, useRef } from 'react'
import { onAuthStateChanged } from "firebase/auth"

import { auth } from '../src/firebaseConfig'
import { getData, SignIn } from "../src/handleEvent"
import { sendPushNotification } from '../src/handleNotification'
import RegisterModal from "../components/RegisterModal/RegisterModal"

const LoginScreen = () => {
    const [expoPushToken, setExpoPushToken] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [initializing, setInitializing] = useState(true)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    const navigation = useNavigation()

    const handleSignIn = async (email, password) => {
        const err = await SignIn(email, password)
        setError(err)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            if (initializing) setInitializing(false)
        })
    
        return unsubscribe; // Unsubscribe on unmount
    }, [initializing])

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
        if (user) {
            const uid = user.uid
            sendPushNotification(expoPushToken)
            .then(() => navigation.navigate("Bottom Navigation", { uid }))
            .catch((error) => setError(error))
        }
    }, [user])

    useEffect(() => {
        if (expoPushToken === null) {
            getData("letsports-expoPushToken").then(({data, error}) => {
                (error) ? setError(error) : setExpoPushToken(data)
            })
        }
    }, [])

    if (initializing) return null;

    if ( !user ) { 
        return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView behavoir="padding"/>
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder="Email"
                    value={email}
                    onChangeText={ text => setEmail(text) }
                    inputMode="email"
                    style={styles.input}
                />
                <TextInput 
                    placeholder="Password"
                    value={password}
                    onChangeText={ text => setPassword(text) }
                    style={styles.input}
                    secureTextEntry={!showPassword}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => handleSignIn(email, password)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={ () => setModalVisible(true) }>
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
            { modalVisible? <RegisterModal setModalVisible={setModalVisible}/> : undefined}
        </SafeAreaView>
    )}
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        width: "80%",
        marginHorizontal: "10%",
        marginVertical: "1.25%",
    },
    input: {
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: "60%",
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
    buttonOutline: {
        backgroundColor: "white",
        marginTop: 5,
        borderColor: "tomato",
        borderWidth: 2,
    },
    buttonText: {
        color: "white",
        fontWeight: 700,
        fontSize: 16,
    },
    buttonOutlineText: {
        color: "tomato",
        fontWeight: 700,
        fontSize: 16,
    },
})

export default LoginScreen