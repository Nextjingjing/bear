import Matter from "matter-js";
import { getPipeSizePosPair } from "./utils/random";
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
    // เมื่อ swipe ขึ้น, ให้ gravity ดึงขึ้น
    engine.gravity.y = -0.35;
  } else if (deltaY > 0) {
    // เมื่อ swipe ลง, ให้ gravity ดึงลง
    engine.gravity.y = 0.35;
  }
};

// สร้างฟังก์ชัน debounce สำหรับปรับ gravity
const debouncedAdjustGravity = debounce(adjustGravity, 40);

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;

  // Find the first 'move' touch event, if there is one
  let move = touches.find(t => t.type === 'move');

  if (move) {
    // Calculate the direction of touch movement (deltaY)
    const deltaY = move.delta.pageY;

    // ใช้ฟังก์ชัน debounced เพื่อหน่วงเวลาการเปลี่ยน gravity
    debouncedAdjustGravity(engine, deltaY);
  }

  // อัปเดต engine ด้วย time step ปัจจุบัน
  Matter.Engine.update(engine, time.delta);

  for(let i = 1; i <= 2; i++) {
    // Check if the obstacle has moved out of the screen (x <= 0)
    if (entities[`ObstacleTop${i}`].body.bounds.max.x <= 0) {
      const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9);
      
      // Reset the position of the top obstacle
      if (entities[`ObstacleTop${i}`] && entities[`ObstacleTop${i}`].body) {
        Matter.Body.setPosition(entities[`ObstacleTop${i}`].body, pipeSizePos.pipeTop.pos);
      }
      
      // Reset the position of the bottom obstacle
      if (entities[`ObstacleBottom${i}`] && entities[`ObstacleBottom${i}`].body) {
        Matter.Body.setPosition(entities[`ObstacleBottom${i}`].body, pipeSizePos.pipeBottom.pos);
      }
    }

    // Move the top obstacle to the left
    if (entities[`ObstacleTop${i}`] && entities[`ObstacleTop${i}`].body) {
      Matter.Body.translate(entities[`ObstacleTop${i}`].body, { x: -0.75, y: 0 });
    }

    // Move the bottom obstacle to the left
    if (entities[`ObstacleBottom${i}`] && entities[`ObstacleBottom${i}`].body) {
      Matter.Body.translate(entities[`ObstacleBottom${i}`].body, { x: -0.75, y: 0 });
    }
  }

  return entities;
};

export default Physics;
