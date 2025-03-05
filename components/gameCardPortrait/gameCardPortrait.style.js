import { StyleSheet } from 'react-native'
import { COLORS, SIZES } from '../../theme'

const styles = StyleSheet.create({
    gameCard: {
        backgroundColor: COLORS.white,
        width: SIZES.width * 0.55,
        height: SIZES.width * 0.75,
        marginBottom: "2.5%",
        marginRight: "2.5%",
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    image: {
        aspectRatio: 4/3,
        resizeMode: "cover",
    },
    contentContainer: {
        flex: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginLeft: "2.5%",
        marginTop: "2.5%",
        padding: "2.5%%"
    },
    title: {
        fontSize: SIZES.width * 0.04,
        marginBottom: "2.5%",
    },
    text:{
        fontSize: SIZES.width * 0.03,
        marginBottom: "2.5%",
    },
    datetime: {
        fontWeight: "bold",
    },
    venue: {
        color: COLORS.gray2,
        fontSize: SIZES.width * 0.03,
    }
})

export default styles