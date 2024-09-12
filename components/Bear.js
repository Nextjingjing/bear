import React from "react";
import { View, Image } from "react-native";
import Matter from "matter-js";

const Bear = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

    const xBody = props.body.position.x - widthBody / 2;
    const yBody = props.body.position.y - heightBody / 2;

    return (
        <Image
            source={require('../assets/bear.png')} // Path to the bear image
            style={{
                position: 'absolute',
                left: xBody,
                top: yBody,
                width: widthBody,
                height: heightBody,
                resizeMode: 'contain' // Makes sure the image fits within the dimensions
            }}
        />
    );
};

// Adding world parameter
export default (world, color, pos, size) => {
    const initialBear = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        { label: 'Bear' }
    );

    // Add Bear to Matter.js world
    Matter.World.add(world, initialBear);

    return {
        body: initialBear,
        color,
        pos,
        renderer: <Bear />
    };
};
