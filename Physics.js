import Matter from "matter-js";
import React from "react";
import Coin from "./components/Coin";
import { getPipeSizePosPair, getRandom } from "./utils/random";
import { Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

// ฟังก์ชัน debounce เพื่อลดความถี่ของการเรียกฟังก์ชัน
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// ฟังก์ชันที่จะใช้ในการปรับค่า gravity ด้วย debounce
const adjustGravity = (engine, deltaY) => {
  if (deltaY < 0) {
    engine.gravity.y = -0.35;
  } else if (deltaY > 0) {
    engine.gravity.y = 0.35;
  }
};

const debouncedAdjustGravity = debounce(adjustGravity, 100);

// ฟังก์ชันนี้จะถูกเรียกครั้งเดียวตอนที่ทำการเริ่มต้น engine
const setupCollisionListener = (engine, dispatch, bearBody, entities) => {
  Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
      const { bodyA, bodyB } = collision;

      // หากหมีชนกับสิ่งกีดขวางใดๆ
      if ((bodyA === bearBody && bodyB.label.startsWith('Obstacle')) || 
          (bodyB === bearBody && bodyA.label.startsWith('Obstacle'))) {
        dispatch({ type: "game_over" });
      }

      // หากหมีชนกับเหรียญ
      if ((bodyA === bearBody && bodyB.label === 'Coin') || 
          (bodyB === bearBody && bodyA.label === 'Coin')) {
        const coinBody = bodyA.label === 'Coin' ? bodyA : bodyB;
        
        // ลบเหรียญออกจากโลกของ Matter.js
        Matter.World.remove(engine.world, coinBody);
        dispatch({ type: "coin_collected" });

        entities['Coin'].coinCollected = true; // บันทึกว่าเหรียญถูกเก็บแล้ว
        entities['Coin'].body = null; // ล้างค่า body ของเหรียญออกจาก entities

        // สร้างเหรียญใหม่ในตำแหน่งใหม่
        const newCoinPos = { x: windowWidth + getRandom(25, 88), y: getRandom(200, windowHeight - 50) };
        const newCoin = Coin(engine.world, 'yellow', newCoinPos, { width: 35, height: 35 })

        entities['Coin'] = newCoin; // อัปเดต body ใหม่เข้าไปใน entities
        entities['Coin'].coinCollected = false; // รีเซ็ตสถานะการเก็บเหรียญ
        // console.log("Coin reset and created again");
      }
    });
  });
};

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;
  let bearBody = entities.Bear.body;

  // ตั้งค่า collision listener หนึ่งครั้ง
  if (!engine.collisionListenerSetup) {
    setupCollisionListener(engine, dispatch, bearBody, entities);
    engine.collisionListenerSetup = true; // ป้องกันการเพิ่ม listener หลายครั้ง
  }

  let move = touches.find(t => t.type === 'move');
  if (move) {
    const deltaY = move.delta.pageY;
    debouncedAdjustGravity(engine, deltaY);
  }

  // จำกัดเวลาสูงสุดของ delta ที่ 16.667 ms (เทียบเท่ากับ 60 FPS)
  const maxDelta = 15;
  Matter.Engine.update(engine, Math.min(time.delta, maxDelta));

  // จัดการกับอุปสรรค
  for (let i = 1; i <= 2; i++) {

    if(entities[`ObstacleTop${i}`].body.bounds.max.x <= 50 && !entities[`ObstacleTop${i}`].point){
      entities[`ObstacleTop${i}`].point = true;
      dispatch({type: 'new_point'});
    }

    if (entities[`ObstacleTop${i}`].body.bounds.max.x <= 0) {
      const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9);
      Matter.Body.setPosition(entities[`ObstacleTop${i}`].body, pipeSizePos.pipeTop.pos);
      Matter.Body.setPosition(entities[`ObstacleBottom${i}`].body, pipeSizePos.pipeBottom.pos);
      entities[`ObstacleTop${i}`].point = false;
    }

    // เคลื่อนย้ายอุปสรรคไปทางซ้ายด้วยอัตราคงที่
    Matter.Body.translate(entities[`ObstacleTop${i}`].body, { x: -1, y: 0 });
    Matter.Body.translate(entities[`ObstacleBottom${i}`].body, { x: -1, y: 0 });
  }

  // จัดการกับเหรียญถ้าเหรียญยังไม่ได้ถูกเก็บ
  const coinBody = entities['Coin'].body;
  if (coinBody && !entities['Coin'].coinCollected) {
    if (coinBody.bounds.max.x <= 0) {
      // รีเซ็ตตำแหน่งเหรียญถ้าเหรียญยังไม่ถูกเก็บแล้วหลุดจากจอ
      Matter.Body.setPosition(coinBody, { x: windowWidth + getRandom(25, 88), y: getRandom(102, windowHeight - 50) });
      // console.log("Coin reset");
    } else {
      // เคลื่อนย้ายเหรียญไปทางซ้าย
      Matter.Body.translate(coinBody, { x: -1, y: 0 });
    }
  }

  return entities;
};

export default Physics;
