import { func } from "prop-types";
import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, View } from "react-native";


const MAX_HEIGHT = Dimensions.get('window').height * 0.9
const MIN_HEIGHT = Dimensions.get('window').height * 0.5
const MAX_UPWARD_TRANSLATE_Y = MIN_HEIGHT - MAX_HEIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 50;
const DraggableBottomSheet = ({}) => {


    const animatedValue = useRef(new Animated.Value(0)).current;
    const lastGestureDy = useRef(0)
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                animatedValue.setOffset(lastGestureDy.current);
            },
            onPanResponderMove: (e, gesture) => {
                animatedValue.setValue(gesture.dy);
            },
            onPanResponderRelease: (e, gesture) => {
                animatedValue.flattenOffset();
                lastGestureDy.current += gesture.dy;
                if (lastGestureDy.current < MAX_UPWARD_TRANSLATE_Y) {
                    lastGestureDy.current = MAX_UPWARD_TRANSLATE_Y;
                } else if (lastGestureDy.current > MAX_DOWNWARD_TRANSLATE_Y) {
                    lastGestureDy.current = MAX_DOWNWARD_TRANSLATE_Y;
                }

                if (gesture.dy > 0) {
                    if (gesture.dy <= DRAG_THRESHOLD) {
                        springAnimation('up');
                    } else {
                        springAnimation('down');
                    }
                }
            },
        }),
    ).current;

    function springAnimation(direction) {
        lastGestureDy.current = (direction === 'down' ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y)
        Animated.springAnimation(animatedValue, {
            toValue: lastGestureDy.current,
            useNativeDriver: true,
        }).start();
    };

    const bottomSheetAnimation = {
        transform: [{translateY: animatedValue.interpolate({
            inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
            outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
            extrapolate: 'clamp',
        })}],

    }

    return (
        <View style={styles.container}>
            <Animated.View style={styles.bottomSheet}>
                <View style={styles.draggableArea} {...panResponder.panHandlers}>
                    <View style={styles.dragHandle}/>
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheet: {
        position: 'absolute',
        width: '100%',
        height: MAX_HEIGHT,
        bottom: MIN_HEIGHT - MAX_HEIGHT,
        elevation: 3,
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    dragHandle: {
        width: 100,
        height: 6,
        backgroundColor: '#d3d3d3',
        borderRadius: 10,
    },
    draggableArea: {
        width: 132,
        height: 32,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default DraggableBottomSheet;