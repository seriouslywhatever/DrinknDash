import React from 'react';
import Animated, { withTiming, useAnimatedStyle, Easing } from "react-native-reanimated";
import LottieView from 'lottie-react-native';

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
            <LottieView
                autoPlay={true}
                style={{
                    width: size,
                    height: size,
                }}
                source={require('../assets/horse_jockey.json')}
            />
        </Animated.View>
    );
}