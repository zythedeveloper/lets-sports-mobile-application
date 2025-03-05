import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { Alert, ActivityIndicator, SafeAreaView, View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native"
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'

import { getSportID, getData, SignUp } from "../../src/handleEvent"
import { COLORS, SIZES } from "../../theme"
import styles from './registerModel.style'

const RegisterModal = ({setModalVisible}) => {
    const [categories, setCategories] = useState([])
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [location, setLocation] = useState({city:'', state:'', country:''})
    const [name, setName] = useState({first:'', middle:'', last:''})
    const [bio, setBio] = useState('')
    const [interests, setInterests] = useState([])
    const [error, setError] = useState(null)

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
        if (categories.length <1) {
            getData("letsports-categories-data").then(({data, error}) => {
                if (error) { 
                    setError(error)
                } else {
                    const formatData = []
                    for (const id of Object.keys(data)) {
                        formatData.push({key: id, value: data[id].name})
                    }
                    setCategories(formatData)
                }
            })
        }
    })

    const handleSignUp = async () => {
        data = {
            email: email,
            password: password,
            name: name,
            location: location,
            bio: bio,
            interests: interests.map(interest => getSportID(interest)),
            mygames: []
        }
        const err = await SignUp(data)
        setError(err)
    }

    const getSportID = (text) => {
        for (const [index, obj] of Object.values(categories).entries()) {
            if (obj.value === text) return obj.key
        }
        return -1
    }

    return ( 
    <Modal
        animationType="slide"
        transparent={true}
        visible={true}
    >
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView behavoir="padding"/>
            <View style={styles.container}>
                <View style={styles.topTabNavigation}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Ionicons name="chevron-back-circle" size={30} color={COLORS.offwhite}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>Create Account</Text>
                </View>
                <ScrollView showsHorizontalScrollIndicator={false}>
                <View style={styles.contentContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Username</Text>
                        <TextInput 
                            placeholder="Email"
                            value={email}
                            onChangeText={ text => setEmail(text) }
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Password</Text>
                        <TextInput 
                            placeholder="Password"
                            value={password}
                            onChangeText={ text => setPassword(text) }
                            style={styles.input}
                            secureTextEntry={!showPassword}
                        />
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Name</Text>
                        <View style={{flexDirection:"row", width: "100%", columnGap: "5%"}}>
                        <TextInput 
                            placeholder="First"
                            value={name.first}
                            onChangeText={ text => {setName(prev => ({...prev, first: text}))} }
                            style={[styles.input, {flex:1}]}
                        />
                        <TextInput 
                                placeholder="Middle"
                                value={name.middle}
                                onChangeText={ text => {setName(prev => ({...prev, middle: text}))} }
                                style={[styles.input, {flex:1}]}
                            />
                        <TextInput 
                            placeholder="Last"
                            value={name.last}
                            onChangeText={ text => {setName(prev => ({...prev, last: text}))} }
                            style={[styles.input, {flex:1}]}
                        />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Location</Text>
                        <View style={{flexDirection:"row", width: "100%", columnGap: "5%"}}>
                        <TextInput 
                            placeholder="City"
                            value={location.city}
                            onChangeText={ text => {setLocation(prev => ({...prev, city: text}))} }
                            style={[styles.input, {flex:1}]}
                        />
                        <TextInput 
                                placeholder="State"
                                value={location.state}
                                onChangeText={ text => {setLocation(prev => ({...prev, state: text}))} }
                                style={[styles.input, {flex:1}]}
                            />
                        <TextInput 
                            placeholder="Country"
                            value={location.country}
                            onChangeText={ text => {setLocation(prev => ({...prev, country: text}))} }
                            style={[styles.input, {flex:1}]}
                        />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Bio</Text>
                        <TextInput 
                            placeholder="Introduce yourself a little..."
                            value={bio}
                            onChangeText={ text => {setBio(text)} }
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Interests</Text>
                        { categories.length > 0 ? 
                            <MultipleSelectList
                                setSelected={(val) => setInterests(val)} 
                                data={categories} 
                                save="value"
                                label="Categories"
                                boxStyles={{backgroundColor: COLORS.offwhite}}
                                dropdownStyles={{backgroundColor: COLORS.offwhite}}
                            /> : <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
                        }
                    </View>
                    <View style={[styles.buttonContainer]}>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={ handleSignUp }>
                            <Text style={styles.buttonOutlineText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    </Modal>
    )
}

export default RegisterModal