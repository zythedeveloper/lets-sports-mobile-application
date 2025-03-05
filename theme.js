import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window');

const COLORS = {
    primary: "#2A4D50",
    secondary: "#DDF0FF",
    tertiary: "#FF7754",

    gray: "#f3f3f3",
    gray2: "#C1C0C8",

    tomato: "tomato",
    offwhite: "#F3F4F8",
    white: "#FFFFFF",
    yellow: "#ffcc4d",
    indigo: "6f57eb",
    black: "#161616",
    red: "#e81e4d",
    green: " #00C135",
    lightWhite: "#FAFAFC",
};


const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 44,
    height,
    width
};


const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },
};


export { COLORS, SIZES , SHADOWS };
