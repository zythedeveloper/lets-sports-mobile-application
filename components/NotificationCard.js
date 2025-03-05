import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'

import { COLORS, SIZES } from '../theme'

const NotificationCard = ({notification}) => {
    return (
        <TouchableOpacity style={styles.container}>
            <FontAwesome name="user-circle-o" size={45} color="black" />
            <Text numberOfLines={1}>{notification.content}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({ 
    container: {
        width: "90%", 
        flexDirection: "row", 
        justifyContent: "flex-start", 
        alignItems: "center", 
        marginVertical: "2.5%", 
        columnGap: "5%"
    }
})

export default NotificationCard