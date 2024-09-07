import Matter from "matter-js";
import Bear from "../components/Bear";

export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false });

    engine.gravity.y = 0.4;

    let world = engine.world;

    // ส่ง world, color, position, และ size ไปยัง Bear function ด้วย
    return {
        physics: { engine, world },
        Bear: Bear(world, 'green', { x: 50, y: 200 }, { width: 40, height: 40 })  // เพิ่มพารามิเตอร์
    };
};
