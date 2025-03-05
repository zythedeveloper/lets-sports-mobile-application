import { StyleSheet } from 'react-native'
import { COLORS, SIZES } from '../../theme'

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gameCard: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: SIZES.medium,
        height: SIZES.width * 0.35,
        marginBottom: "5%",
        marginHorizontal: "2.5%",
        padding: "2.5%%"
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    image: {
        flex: 1,
        borderRadius: SIZES.medium,
        width: "100%",
        height: "100%",
    },
    contentContainer: {
        flex: 2,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        marginLeft: "2.5%",
    },
    title: {
        fontWeight: "bold",
        fontSize: SIZES.width * 0.06,
        marginBottom: "2.5%",
    },
    text:{
        fontSize: SIZES.width * 0.03,
        marginBottom: "2.5%",
    }
})

export default styles