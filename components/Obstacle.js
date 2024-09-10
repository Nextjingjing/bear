import React from "react";
import { View } from "react-native";
import Matter from "matter-js";

const Obstacle = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

    const xBody = props.body.position.x - widthBody / 2;
    const yBody = props.body.position.y - heightBody / 2;

    const color = props.color;

    return (
        <View style={{
            backgroundColor: color,
            borderWidth: 1,
            borderColor: color,
            borderStyle: 'solid',
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody
        }} />
    );
};

// เพิ่มพารามิเตอร์ world
export default (world, color, pos, size) => {
    const initialObstacle = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        { 
        label: 'Obstacle', 
        isStatic: true
        }
    );

    // เพิ่ม Bear ลงใน world ของ Matter.js
    Matter.World.add(world, initialObstacle);

    return {
        body: initialFloor,
        color,
        pos,
        renderer: <Obstacle/>
    };
};