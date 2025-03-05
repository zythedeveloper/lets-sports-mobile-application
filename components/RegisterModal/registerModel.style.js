import { StyleSheet } from "react-native"

import { COLORS, SIZES } from "../../theme"

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "90%", 
        height: "90%", 
        backgroundColor: COLORS.tomato, 
        borderRadius: "35%"
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
        // marginTop: 40,
    },
    button: {
        backgroundColor: COLORS.tomato,
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom:"5%", 
        marginHorizontal:"20%"
    },
    buttonOutline: {
        backgroundColor: COLORS.offwhite,
        marginTop: 5,
        borderColor: COLORS.tomato,
        borderWidth: 2,
    },
    buttonText: {
        color: COLORS.offwhite,
        fontWeight: 700,
        fontSize: 16,
    },
    buttonOutlineText: {
        color: COLORS.tomato,
        fontWeight: 700,
        fontSize: 16,
    },
    topTabNavigation: {
        // position: "absolute",
        marginHorizontal: "5%",
        paddingVertical: "2.5%",
        backgroundColor: COLORS.tomato,
        flexDirection: "row",
        alignItems: "center",
        top: "2.5%",
        width: "90%",
        zIndex: 999,
    },
    contentContainer: {
        flex: 1,
        marginTop: "10%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: SIZES.width * 0.06,
        color: COLORS.offwhite,
        marginLeft: "17.5%",
    },
    text:{
        fontWeight: "bold",
        textAlign: "flex-start",
        fontSize: SIZES.width * 0.035,
        color: COLORS.offwhite,
    },
})

export default styles