import { TouchableOpacity,Text, View, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import styles from './categoryCard.style'

const CategoryCard = ({item}) => {  
    const navigation = useNavigation()
    const navigateToSearch = (text) => navigation.navigate("Search", {text})

    return (
    <View style={styles.container}>
        <TouchableOpacity style={[styles.categoryCard, styles.shadowProp]} onPress={() => navigateToSearch(item.name)}>
            <Image style={styles.image} src={item.uri} />
            <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity>
    </View>
    )
}

export default CategoryCard