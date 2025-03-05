import AsyncStorage from "@react-native-async-storage/async-storage"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { arrayUnion, doc, limit, addDoc, updateDoc, getDoc, getDocs, setDoc, query, increment } from "firebase/firestore"
import { auth, db } from "./firebaseConfig"

clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('Done.')
}

// clean up AsyncStorage
// clearAll()

/* Firebase authetication */
const SignUp = async ({email, password, name, location, bio ,interests}) => {
    const error = {
        status: false,
        code: undefined,
        message: undefined
    }

    try {
        const {user} = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password)
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            location: location,
            bio: bio,
            interests: interests
        })
        await setDoc(doc(db, "inbox", user.uid), {
            notifications: [{content: "You have unlocked the 'Newcomer' achievement.", datetime: new Date()}] 
        })
    } catch (err) {
        // Handle errors here
        error.code = err.code
        error.status = true

        switch (err.code) {
            case "auth/weak-password":
                error.message = "The password is too weak."
                break
            case "auth/email-already-in-use":
                error.message = "This email address is already in use by another account."
                break
            case "auth/invalid-email":
                error.message = "This email address is invalid."
                break
            case "auth/operation-not-allowed":
                error.message = "Email/password accounts are not enabled."
                break
            default:
                error.message = err.message
                break
        }
    }
    return error
}

const SignIn = async (email, password) => {
    const error = {
        status: false,
        code: undefined,
        message: undefined
    }

    try {
        await signInWithEmailAndPassword(auth, email.toLowerCase(), password)
    } catch (err) {
        // Handle errors here
        error.code = err.code
        error.status = true

        switch (err.code) {
            case "auth/invalid-credential":
                error.message = "This email address / password is wrong."
                break
            case "auth/invalid-email":
                error.message = "This email address is invalid."
                break
            case "auth/user-disabled":
                error.message = "This email address is disabled by the administrator."
                break;
            case "auth/user-not-found":
                error.message = "This email address is not registered."
                break
                break
            default:
                error.message = err.message
                break
        }
    }

    return error
}

const SignOut = async () => {
    const error = {
        status: false,
        code: undefined,
        message: undefined
    }

    try {
        await signOut(auth)
    } catch (err) {
        // Handle errors here
        error.code = err.code
        error.status = true

        switch (err.code) {
            default:
                error.message = err.message
                break
        }
    }

    return error
}

/* Firestore database */
// fetch document from firestore
const fetchData = async (documentRef) => {
    const response = {
        data: null,
        error: null
    }

    try {
        const docSnap = await getDoc(documentRef)
        if (docSnap.exists()) response.data = docSnap.data()
        else response.error = {status: true, code: "custom", message: "No such data"}
    } catch (err) {
        response.error = {status: true, code: err.code, message: err.message}
    }
    return response
}

// fetch collection from firestore
const fetchCollection = async (collectionRef, limitCount=null) => {
    const response = {
        data: null,
        error: null
    }

    try {
        const limitedQuery = (limitCount !== null) ? query(collectionRef, limit(limitCount)) : collectionRef
        const obj = {}
        const querySnapshot = await getDocs(limitedQuery)
        querySnapshot.forEach(document => {
            obj[document.id] = document.data()
        })
        response.data = obj
    } catch (err) {
        response.error = {status: true, code: err.code, message: err.message}
    }
    return response
}

// add document into collection
const addActivity = async (collectionRef, data) => {
    const response = {
        data: null,
        error: null
    }
    try {
        const docRef = await addDoc(collectionRef, data)
        response.data = docRef.id
    } catch (err) {
        response.error = {status: true, code: err.code, message: err.message}
    }
    return response
}

// update document from collection
const updateMyGames = async (documentRef, data) => {
    const error = {
        status: false,
        code: undefined,
        message: undefined
    }
    try {
        await updateDoc(documentRef, {
            mygames: arrayUnion(data)
        })
    } catch (err) {
        error.status = true
        error.code = err.code
        error.message= err.message
    }
    return error
}

const updateJoinedBy = async (documentRef, data) => {
    const error = {
        status: false,
        code: undefined,
        message: undefined
    }
    try {
        await updateDoc(documentRef, {
            joinedBy: arrayUnion(data),
            occupiedSlot: increment(1)
        })
    } catch (err) {
        error.status = true
        error.code = err.code
        error.message= err.message
    }
    return error
}

/* Async Storage */
// read data
const getData = async (key) => {
    const response = {
        data: null,
        error: null
    }

    try {
        const value = await AsyncStorage.getItem(key)
        if (value != null) response.data = JSON.parse(value)
        else response.error = {status: true, code: "custom", message: "No such data"}
    } catch (err) {
        response.error = {status: true, code: err.code, message: err.message}
    }
    return response
}

// store the data
const storeData = async (key, value) => {
    const error = {
        status: false,
        code: undefined,
        message: undefined
    }
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (err) {
        error.status = true
        error.code = err.code
        error.message= err.message
        return error
    }
}

// remove the data
const removeData = async (key) => {
    const error = {
        status: false,
        code: undefined,
        message: undefined
    }
    try {
        await AsyncStorage.removeItem(key)
    } catch (err) {
        error.status = true
        error.code = err.code
        error.message= err.message
        return error
    }
}

export { SignIn, SignUp, SignOut, getData, storeData, removeData, fetchCollection, fetchData, addActivity, updateMyGames, updateJoinedBy }