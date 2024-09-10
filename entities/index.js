import Matter from "matter-js";
import Bear from "../components/Bear";
import Floor from "../components/Floor";
import Obstacle from "../components/Obstacle";
import { Dimensions } from "react-native";
import { getPipeSizePosPair } from "../utils/random";


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false });

    engine.gravity.y = 0.35;

    let world = engine.world;

    const pipeSizePosA = getPipeSizePosPair()
    // ส่ง world, color, position, และ size ไปยัง Bear function ด้วย
    return {
        physics: { engine, world },
        Bear: Bear(world, 'green', { x: 50, y: 200 }, { width: 80, height: 80 }),
        Floor: Floor(world, 'green', { x: windowWidth/2, y: windowHeight }, { width: windowWidth, height: 150 }),
        ObstacleTop1: Obstacle(world, 'ObstacleTop1', 'red', pipeSizePosA.pipeTop.pos, pipeSizePosA.pipeTop.size),
        ObstacleBottom: Obstacle(world, 'Obstaclebottom1', 'blue', pipeSizePosA.pipeBottom.pos, pipeSizePosA.pipeBottom.size),
        Ceiling: Floor(world, 'green', { x: windowWidth/2, y: 0 }, { width: windowWidth, height: 150 })
    };
};
