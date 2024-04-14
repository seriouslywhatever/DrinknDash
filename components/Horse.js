import React from 'react';
import Animated, { withTiming, useAnimatedStyle, Easing } from "react-native-reanimated";

const jockey = require('../assets/jockey.gif');

/**
 * Horse component to move in Game screen.
 * Retrieve values to determine image size and movement distance.
 */
export default Horse = (props) => {

    const translateX = props.distance;
    const size = props.size;

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{
            translateX: withTiming(translateX.value * 2, {
                duration: 750,
                easing: Easing.ease,
            })
        }],
    }));

    return (
        <Animated.View style={[animatedStyles, { width: size, height: size }]}>
            <Animated.Image
                source={jockey}
                style={{
                    width: size,
                    height: size,
                    resizeMode: 'contain',
                }}
            />
        </Animated.View>
    );
}