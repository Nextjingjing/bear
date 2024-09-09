import Matter from "matter-js";

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;

  // Find the first 'move' touch event, if there is one
  let move = touches.find(t => t.type === 'move');

  // If a 'move' touch event exists and the Bear entity is present
  if (move && entities.Bear) {
    // Calculate the velocity based on touch movement (deltaX, deltaY)
    const velocityX = move.delta.pageX;
    const velocityY = move.delta.pageY;

    // Set velocity for the Bear's body using Matter.Body.setVelocity
    Matter.Body.setVelocity(entities.Bear.body, {
      x: velocityX,
      y: velocityY,
    });
  }

  // Update the engine with the current time step
  Matter.Engine.update(engine, time.delta);

  return entities;
};

export default Physics;
