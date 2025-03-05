import { StyleSheet } from 'react-native'
import { COLORS, SIZES } from '../../theme'

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.medium,
    },
    categoryCard: {
        width: SIZES.width * 0.3,
        aspectRatio: 1,
        marginBottom: "2.5%",
    },
    image: {
        aspectRatio: 4/3,
        resizeMode: "cover",
        borderRadius: SIZES.medium,
    },
    shadowProp: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
})

export default styles