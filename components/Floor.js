import React from "react";
import { View, ImageBackground } from "react-native";
import Matter from "matter-js";

// นำเข้ารูปจาก assets
const floorImage = require('../assets/floor.png'); // อ้างถึงรูปภาพจาก assets

const Floor = (props) => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

    const xBody = props.body.position.x - widthBody / 2;
    const yBody = props.body.position.y - heightBody / 2;

    const color = props.color;
    const image = props.image; // รูปภาพที่ส่งเข้ามา

    return (
        <View style={{
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody,
            overflow: 'hidden', // ซ่อนส่วนที่เกินขอบของพื้น
        }}>
            {/* ใช้ ImageBackground เพื่อแสดงรูปภาพ */}
            <ImageBackground
                source={image}
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

// ยังคงพารามิเตอร์ world, color, pos, size เหมือนเดิม
export default (world, color, pos, size) => {
    const initialFloor = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        { 
        label: 'Floor', 
        isStatic: true
        }
    );

    // เพิ่ม Floor ลงใน world ของ Matter.js
    Matter.World.add(world, initialFloor);

    return {
        body: initialFloor,
        color,
        pos,
        image: floorImage, // ส่งรูปภาพจาก assets
        renderer: <Floor color={color} image={floorImage} />
    };
};
