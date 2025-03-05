import { ActivityIndicator, Alert, ScrollView, SafeAreaView, KeyboardAvoidingView, Modal, TouchableOpacity, Text, TextInput, View } from 'react-native'
import { useState, useEffect } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from '@expo/vector-icons'

import { addActivity, updateMyGames, getData } from '../../src/handleEvent'
import { SIZES, COLORS } from '../../theme'
import styles from './createGameModal.style'
import { collection, doc } from 'firebase/firestore'
import { db } from '../../src/firebaseConfig'

const CreateGameModal = ({uid, setModalVisible}) => {
    const [loading, setLoading] = useState(false)
    const [modalPage, setModalPage] = useState(1)
    const [user, setUser] = useState(null)
    const [categories, setCategories] = useState([])
    const [activity, setActivity] = useState("")
    const [gameLevel, setGameLevel] = useState("")
    const [gameFees, setGameFees] = useState("")
    const [maxSlots, setMaxSlots] = useState(0)
    const [location, setLocation] = useState({venue:'', city:'', state:'', country:''})
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)

    // DateTimePicker variables
    const [datetime, setDateTime] = useState(new Date())

    const navigation = useNavigation()
    const level = [
        {key:1, value:"Beginner"}, {key:2, value:"Mid Beginner"}, {key:3, value:"High Beginner"}, 
        {key:4,value:"Mid Intermediate"}, {key:5,value:"High Intermediate"}, 
        {key:5, value:"Advance"}, {key:6,value:"Professional"}
    ]
    const numOfSlots = Array.from({length: 19}, (v, i) => i + 2)

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
    }, [])
    
    const handleCreate = async () => {
        setLoading(true)
        const game = {
            hostedBy: uid,
            category: getSportID(activity),
            gameLevel: gameLevel,
            entryFees: gameFees,
            maxSlot: maxSlots,
            occupiedSlot: 1,
            joinedBy: [uid],
            isPublic: true,
            isRecruiting: true,
            location: location,
            description: description
        }
        try {
            const collectionRef = collection(db, "games")
            const documentRef = doc(db, "users", uid)
            const {data, error} = await addActivity(collectionRef ,game)

            if (data) await updateMyGames(documentRef, data)
            if (error && error.status) setError(error)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const renderPage = (modalPage) => {
        switch (modalPage) {
          case 1:
            return (
                <View style={styles.contentContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>What activity you are doing?</Text>
                        { categories.length > 0 ? 
                            <SelectList
                                setSelected={(val) => setActivity(val)} 
                                data={categories} 
                                save="value"
                                boxStyles={{backgroundColor: COLORS.offwhite}}
                                dropdownStyles={{backgroundColor: COLORS.offwhite}}
                            /> : <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/>
                        }
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>What is the game level?</Text>
                        <SelectList
                                setSelected={(val) => setGameLevel(val)} 
                                data={level} 
                                save="value"
                                boxStyles={{backgroundColor: COLORS.offwhite}}
                                dropdownStyles={{backgroundColor: COLORS.offwhite}}
                        /> 
                    </View>
                </View>
            )
          case 2:
            return (
                <View style={styles.contentContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Where will the game be?</Text>
                        <TextInput 
                            placeholder="Venue"
                            value={location.venue}
                            onChangeText={ text => {setLocation(prev => ({...prev, venue: text}))} }
                            style={[styles.input, {flex:1}]}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={{flexDirection:"row", width: "100%", columnGap: "5%"}}>
                            <View>
                                <Text style={styles.text}>Date</Text>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={datetime}
                                    mode={"date"}
                                    is24Hour={true}
                                    onChange={(event, selectedDate) => setDateTime(selectedDate)}
                                    style={{flex: 1}}
                                />
                            </View>
                            <View>
                                <Text style={styles.text}>Time</Text>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={datetime}
                                    mode={"time"}
                                    is24Hour={true}
                                    onChange={(event, selectedDate) => setDateTime(selectedDate)}
                                    style={{flex: 1}}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            )
          case 3:
            return (
            <View style={styles.contentContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>How many players are in the game?</Text>
                    <SelectList
                        setSelected={(val) => setMaxSlots(val)} 
                        data={numOfSlots} 
                        save="value"
                        boxStyles={{backgroundColor: COLORS.offwhite}}
                        dropdownStyles={{backgroundColor: COLORS.offwhite}}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>How much does it cost per person?</Text>
                    <TextInput 
                        placeholder="$8"
                        value={gameFees}
                        onChangeText={ text => setGameFees(text) }
                        keyboardType="number-pad"
                        inputMode="numeric"
                        style={[styles.input, {flex:1}]}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.text}>Anything to take note of?</Text>
                    <TextInput 
                        placeholder=""
                        value={description}
                        onChangeText={ text => setDescription(text) }
                        multiline={true}
                        style={[styles.input, {flex:1}]}
                    />
                </View>
            </View>
            )
        }
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
        visible={true}>
            <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView behavoir="padding"/>
            { (!loading) ? (
                <View style={styles.container}>
                    <View style={styles.topTabNavigation}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="chevron-back-circle" size={30} color={COLORS.offwhite}/>
                        </TouchableOpacity>
                        <Text style={styles.title}>Create Activity</Text>
                    </View>
                    <ScrollView showsHorizontalScrollIndicator={false}>
                        { renderPage(modalPage) }
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => {
                            if (modalPage > 1) setModalPage(prev => prev-1)
                        }}>
                            <Text style={styles.buttonOutlineText}>Back</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button]} onPress={() => {
                            if (modalPage < 3) setModalPage(prev => prev+1)
                            else if (modalPage == 3) handleCreate().then(() => setModalVisible(false))
                        }}>
                            <Text style={styles.buttonText}>{(modalPage ==  3) ? "Create" : "Next"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                ) : ( <ActivityIndicator style={{flex: 1, justifyContent: "center", alignContent: "center"}}/> ) 
            }
            </SafeAreaView>
        </Modal>
    )
}

export default CreateGameModal