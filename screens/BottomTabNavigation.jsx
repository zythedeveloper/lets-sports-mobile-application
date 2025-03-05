import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../theme'
import { Home, Explore, Profile, Inbox } from './index'

const Tab = createBottomTabNavigator()
const screenOptions = {
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 70
    }
}

const BottomTabNavigation = ({route}) => {
    const { uid } = route.params

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen 
                name="Home" 
                component={Home}
                initialParams={{ uid: uid }}
                options={{
                    tabBarIcon: ({ focused }) => 
                        <Ionicons size={24} name={focused ? "home-sharp" : "home-outline"} color={focused ? COLORS.tomato : COLORS.gray2} />
                }}
            />
            <Tab.Screen 
                name="Explore" 
                component={Explore} 
                initialParams={{ uid: uid }}
                options={{
                    tabBarIcon: ({ focused }) =>   
                        <MaterialIcons size={24} name={"explore"} color={focused ? COLORS.tomato : COLORS.gray2} />
                }}
            />
            <Tab.Screen 
                name="Inbox" 
                component={Inbox} 
                initialParams={{ uid: uid }}
                options={{
                    tabBarIcon: ({ focused }) =>   
                        <MaterialIcons size={24} name="mail" color={focused ? COLORS.tomato : COLORS.gray2} />
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={Profile} 
                initialParams={{ uid: uid }}
                options={{
                    tabBarIcon: ({ focused }) => 
                        <Ionicons size={24} name={focused ? "person" : "person-outline"} color={focused ? COLORS.tomato : COLORS.gray2} />
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation