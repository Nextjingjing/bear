import Matter from "matter-js";
import Bear from "../components/Bear";
import Floor from "../components/Floor";
import Obstacle from "../components/Obstacle";
import { Dimensions } from "react-native";
import { getPipeSizePosPair } from "../utils/random";
import Coin from "../components/Coin";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    engine.gravity.y = 0.35;
    
    let world = engine.world;

    // สร้างตำแหน่งของท่อทั้งสอง
    const pipeSizePosA = getPipeSizePosPair();
    const pipeSizePosB = getPipeSizePosPair(windowWidth * 0.85);

    // กำหนดตำแหน่งคงที่ให้กับเหรียญให้อยู่ระหว่างท่อชุดแรกและชุดที่สอง
    // ในที่นี้จะกำหนดค่าคงที่ให้เหรียญอยู่ระหว่างท่อทั้งสองในแกน X
    const coinXPos = (pipeSizePosA.pipeTop.pos.x + pipeSizePosB.pipeTop.pos.x) / 2; // กึ่งกลางระหว่างท่อบนทั้งสอง
    const coinYPos = (pipeSizePosA.pipeBottom.pos.y + pipeSizePosA.pipeTop.pos.y) / 2; // ตำแหน่งที่อยู่ระหว่างท่อบนและท่อล่าง

    return {
        physics: { engine, world },
        Bear: Bear(world, 'green', { x: 50, y: 200 }, { width: 64, height: 64 }),

        // Coin ที่อยู่ระหว่างท่อชุดแรกและชุดที่สองในแกน X และ Y
        Coin: Coin(world, 'yellow', { x: coinXPos, y: coinYPos }, { width: 35, height: 35 }),

        ObstacleTop1: Obstacle(world, 'ObstacleTop1', 'red', pipeSizePosA.pipeTop.pos, pipeSizePosA.pipeTop.size),
        ObstacleBottom1: Obstacle(world, 'ObstacleBottom1', 'blue', pipeSizePosA.pipeBottom.pos, pipeSizePosA.pipeBottom.size),

        ObstacleTop2: Obstacle(world, 'ObstacleTop2', 'red', pipeSizePosB.pipeTop.pos, pipeSizePosB.pipeTop.size),
        ObstacleBottom2: Obstacle(world, 'ObstacleBottom2', 'blue', pipeSizePosB.pipeBottom.pos, pipeSizePosB.pipeBottom.size),
        Floor: Floor(world, 'green', { x: windowWidth / 2, y: windowHeight }, { width: windowWidth, height: 150 }),
        Ceiling: Floor(world, 'green', { x: windowWidth / 2, y: 0 }, { width: windowWidth, height: 150 })

    };
};
