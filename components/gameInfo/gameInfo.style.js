import { StyleSheet } from 'react-native'
import { COLORS, SIZES } from '../../theme'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: "white",
    },
    topTabNavigation: {
        position: "absolute",
        marginHorizontal: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        top: "7.5%",
        width: SIZES.width - (SIZES.width * 0.1),
        zIndex: 999,
    },
    coverImage: {
        aspectRatio: 4/3,
        resizeMode: "cover",
    },
    contentContainer: {
        paddingVertical: "2.5%",
        paddingHorizontal: "10%",
        backgroundColor: COLORS.white,
        marginTop: -SIZES.medium,
        borderTopLeftRadius: SIZES.medium,
        borderTopRightRadius: SIZES.medium,
    },
    title: {
        fontWeight: "bold",
        fontSize: SIZES.width * 0.06,
        marginVertical: "2.5%",
    },
    text:{
        marginLeft: "2.5%",
        textAlign: "center",
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
    footer: {
        flexDirection: "row",
        position: "absolute",
        top: SIZES.height * 0.9,
        width: SIZES.width,
        height: SIZES.height * 0.1,
        backgroundColor: "#f3f4f5",
        alignItems: "flex-start",
        justifyContent: "space-between",
        borderTopWidth: 2,
    },
    priceWrapper: {
        marginTop: "3.5%",
        marginHorizontal: "5%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    price: {
        textAlign: "justify",
        fontSize: SIZES.width * 0.065,
        fontWeight: "bold",
    },
    btnJoin: {
        backgroundColor: "red",
        width: "20%",
        height: "50%",
        justifyContent: "center",
        marginTop: "2.5%",
        marginHorizontal: "5%",
    },
    btnText: {
        fontWeight: "bold",
        fontSize: SIZES.width * 0.05,
        color: "white",
        textAlign: "center"
    },
})

export default styles