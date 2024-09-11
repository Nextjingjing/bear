import Matter from "matter-js";
import { getPipeSizePosPair, getRandom } from "./utils/random"; // เพิ่ม getRandom เพื่อใช้ในการสุ่มตำแหน่ง y
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

// This should be called only once when initializing the engine
const setupCollisionListener = (engine, dispatch, bearBody) => {
  Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
      const { bodyA, bodyB } = collision;

      // If Bear collides with any obstacle
      if ((bodyA === bearBody && bodyB.label.startsWith('Obstacle')) || 
          (bodyB === bearBody && bodyA.label.startsWith('Obstacle'))) {
        dispatch({ type: "game-over" });
      }

      // If Bear collides with a coin
      if ((bodyA === bearBody && bodyB.label === 'Coin') || 
          (bodyB === bearBody && bodyA.label === 'Coin')) {
        const coinBody = bodyA.label === 'Coin' ? bodyA : bodyB;
        Matter.World.remove(engine.world, coinBody);
        console.log("getting coin");
        dispatch({ type: "coin-collected" });
      }
    });
  });
};

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;
  let bearBody = entities.Bear.body;

  // Only set up the collision listener once
  if (!engine.collisionListenerSetup) {
    setupCollisionListener(engine, dispatch, bearBody);
    engine.collisionListenerSetup = true; // To prevent adding multiple listeners
  }

  let move = touches.find(t => t.type === 'move');
  if (move) {
    const deltaY = move.delta.pageY;
    debouncedAdjustGravity(engine, deltaY);
  }

  // Cap the delta time at 16.667 ms (which is equivalent to 60 FPS)
  const maxDelta = 15;
  Matter.Engine.update(engine, Math.min(time.delta, maxDelta));

  for (let i = 1; i <= 2; i++) {
    if (entities[`ObstacleTop${i}`].body.bounds.max.x <= 0) {
      const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9);
      Matter.Body.setPosition(entities[`ObstacleTop${i}`].body, pipeSizePos.pipeTop.pos);
      Matter.Body.setPosition(entities[`ObstacleBottom${i}`].body, pipeSizePos.pipeBottom.pos);
    }

    // Move obstacles to the left at a fixed rate
    Matter.Body.translate(entities[`ObstacleTop${i}`].body, { x: -0.75, y: 0 });
    Matter.Body.translate(entities[`ObstacleBottom${i}`].body, { x: -0.75, y: 0 });
  }

  // Move the coin to the left and reset its position if it moves out of screen
  const coinBody = entities['Coin'].body;
  if (coinBody.bounds.max.x <= 0) {
    // Reset coin's position to the center of the screen (x: middle, y: middle)
    Matter.Body.setPosition(coinBody, { x: windowWidth + getRandom(25, 88), y: getRandom(102, windowHeight - 50) });
  } else {
    // Move the coin to the left
    Matter.Body.translate(coinBody, { x: -0.75, y: 0 });
  }

  return entities;
};

export default Physics;

