import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Matter from "matter-js";

// Constants for the Sprite Sheet
const SPRITE_WIDTH = 64; // Width of each frame in the sprite sheet
const SPRITE_HEIGHT = 64; // Height of each frame in the sprite sheet
const TOTAL_FRAMES = 6;   // Total number of frames in the sprite sheet
const ANIMATION_SPEED = 100; // Speed of the animation (milliseconds per frame)

const Bear = (props) => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

    const xBody = props.body.position.x - widthBody / 2;
    const yBody = props.body.position.y - heightBody / 2;

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Create animation with setInterval to "warp" between frames
        let frameIndex = 0;
        const interval = setInterval(() => {
            frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
            animatedValue.setValue(frameIndex); // Instantly change frames
        }, ANIMATION_SPEED);

        // Clean up interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    // Calculate the X position in the sprite sheet to display (according to the frame number)
    const frameTranslateX = animatedValue.interpolate({
        inputRange: Array.from({ length: TOTAL_FRAMES }, (_, i) => i), // input [0, 1, 2, ..., TOTAL_FRAMES-1]
        outputRange: Array.from({ length: TOTAL_FRAMES }, (_, i) => -i * SPRITE_WIDTH), // output [0, -64, -128, ...]
        extrapolate: 'clamp', // Prevent extrapolating beyond the defined range
    });

    return (
        <View style={{
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody,
            overflow: 'hidden', // Ensure only the current frame is visible
        }}>
            {/* Use Animated.Image to display the bear's sprite sheet */}
            <Animated.Image
                source={require('../assets/bear.png')} // Path to the bear sprite sheet
                style={{
                    width: SPRITE_WIDTH * TOTAL_FRAMES, // Total width of the sprite sheet
                    height: SPRITE_HEIGHT, // Height of one frame in the sprite sheet
                    transform: [{ translateX: frameTranslateX }], // Move to the correct frame
                }}
            />
        </View>
    );
};

// Function to add Bear to Matter.js world
export default (world, color, pos, size) => {
    const initialBear = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        { 
            label: 'Bear',
        }
    );

    // Add the Bear to the Matter.js world
    Matter.World.add(world, initialBear);

    return {
        body: initialBear,
        color,
        pos,
        renderer: <Bear /> // Use the Bear component to render the bear with animation
    };
};
