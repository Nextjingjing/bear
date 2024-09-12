import React from "react";
import { View, ImageBackground } from "react-native";
import Matter from "matter-js";

// นำเข้ารูปภาพ obstacle
const obstacleImage = require('../assets/obstacle.png');

const Obstacle = (props) => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

    const xBody = props.body.position.x - widthBody / 2;
    const yBody = props.body.position.y - heightBody / 2;

    const color = props.color;

    return (
        <View style={{
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody,
            overflow: 'hidden', // ซ่อนส่วนที่เกินขอบของ obstacle
        }}>
            {/* ใช้ ImageBackground เพื่อแสดงรูปภาพ obstacle */}
            <ImageBackground
                source={obstacleImage}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                resizeMode="repeat" // ทำซ้ำรูปภาพเมื่อขนาดไม่พอ
            >
              
            </ImageBackground>
        </View>
    );
};

// ยังคงพารามิเตอร์ world, label, color, pos, size เหมือนเดิม
export default (world, label, color, pos, size) => {
    const initialObstacle = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        { 
            label,
            isStatic: true
        }
    );

    // เพิ่ม obstacle ลงใน world ของ Matter.js
    Matter.World.add(world, initialObstacle);

    return {
        body: initialObstacle,
        color,
        pos,
        renderer: <Obstacle />
    };
};
