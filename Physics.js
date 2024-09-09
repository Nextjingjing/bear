import Matter from "matter-js";

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;

  // Find the first 'move' touch event, if there is one
  let move = touches.find(t => t.type === 'move');

  if (move) {
    // Calculate the direction of touch movement (deltaY)
    const deltaY = move.delta.pageY;

    // Adjust gravity based on touch movement (up or down)
    if (deltaY < 0) {
      // When swiping upwards, make gravity pull upwards (negative gravity)
      engine.gravity.y = -0.4;  // Adjust this value as needed for stronger or weaker upward gravity
    } else if (deltaY > 0) {
      // When swiping downwards, make gravity pull downwards (positive gravity)
      engine.gravity.y = 0.4;   // Adjust this value as needed for stronger or weaker downward gravity
    }
  }

  // Update the engine with the current time step
  Matter.Engine.update(engine, time.delta);

  return entities;
};

export default Physics;
