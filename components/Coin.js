import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Matter from "matter-js";

// กำหนดค่าที่เกี่ยวข้องกับ Sprite Sheet
const SPRITE_WIDTH = 32; // ความกว้างของแต่ละเฟรม
const SPRITE_HEIGHT = 32; // ความสูงของแต่ละเฟรม
const TOTAL_FRAMES = 6;   // จำนวนเฟรมทั้งหมด
const ANIMATION_SPEED = 100; // ความเร็วในการแสดงเฟรม (มิลลิวินาทีต่อเฟรม)

const Coin = (props) => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;

    const xBody = props.body.position.x - widthBody / 2;
    const yBody = props.body.position.y - heightBody / 2;

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // สร้างแอนิเมชันด้วย setInterval เพื่อวาร์ปทีละเฟรม
        let frameIndex = 0;
        const interval = setInterval(() => {
            frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
            animatedValue.setValue(frameIndex); // เปลี่ยนเฟรมทันที
        }, ANIMATION_SPEED);

        // ล้าง setInterval เมื่อคอมโพเนนต์ unmount
        return () => clearInterval(interval);
    }, []);

    // ตำแหน่ง X ใน sprite sheet ที่ควรแสดง (ตามจำนวนเฟรม)
    const frameTranslateX = animatedValue.interpolate({
        inputRange: Array.from({ length: TOTAL_FRAMES }, (_, i) => i), // input [0, 1, 2, ..., TOTAL_FRAMES-1]
        outputRange: Array.from({ length: TOTAL_FRAMES }, (_, i) => -i * SPRITE_WIDTH), // output [0, -32, -64, ...]
        extrapolate: 'clamp', // ทำให้ค่าเกินสุดท้ายคงอยู่
    });

    return (
        <View style={{
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody,
            overflow: 'hidden',
        }}>
            {/* ใช้ Animated.Image เพื่อแสดงแอนิเมชันของเหรียญ */}
            <Animated.Image
                source={require('../assets/coin.png')} // อ้างถึงภาพ Sprite Sheet ของเหรียญ
                style={{
                    width: SPRITE_WIDTH * TOTAL_FRAMES, // ความกว้างของภาพ sprite ทั้งหมด
                    height: SPRITE_HEIGHT,
                    transform: [{ translateX: frameTranslateX }], // เคลื่อนที่เพื่อแสดงเฟรมทีละเฟรมแบบวาร์ป
                }}
            />
        </View>
    );
};

// ฟังก์ชันเพื่อเพิ่ม Coin ลงใน Matter.js world
export default (world, color, pos, size) => {
    const initialCoin = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        { 
            label: 'Coin', // กำหนด label ให้กับ Coin เพื่อใช้ในการตรวจสอบการชน
            isStatic: true, // Coin จะไม่เคลื่อนที่
            isSensor: true  // ทำให้ Coin เป็นวัตถุแบบผี (ghost)
        }
    );

    // เพิ่ม Coin ลงใน world ของ Matter.js
    Matter.World.add(world, initialCoin);

    return {
        body: initialCoin,
        color,
        pos,
        renderer: <Coin/> // ใช้คอมโพเนนต์ Coin ที่สร้างแอนิเมชันของเหรียญ
    };
};
