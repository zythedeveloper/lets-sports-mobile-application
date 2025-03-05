import { StyleSheet } from "react-native"

import { COLORS, SIZES } from "../../theme"

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.offwhite+'95', 
    },
    container: {
        width: "90%", 
        height: "60%", 
        backgroundColor: COLORS.tomato, 
        borderRadius: "35%"
    },
    topTabNavigation: {
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
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        paddingVertical: "10%",
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
        marginBottom: "1.25%",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: "10%",
        paddingBottom: "5%",
        columnGap: "25%",
    },
    button: {
        backgroundColor: COLORS.tomato,
        flex: 1,
        padding: 15,
        borderRadius: 10,
        borderColor: COLORS.offwhite,
        borderWidth: 2,
        alignItems: "center",
    },
    buttonOutline: {
        backgroundColor: COLORS.offwhite,
        marginTop: 5,
        borderColor: COLORS.offwhite,
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
})

export default styles