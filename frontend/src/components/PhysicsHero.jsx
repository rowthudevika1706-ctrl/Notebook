import { useEffect, useRef } from "react";
import Matter from "matter-js";

const PhysicsHero = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
    } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    world.gravity.y = 0.5;

    const render = Render.create({
      canvas: canvasRef.current,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "transparent",
      },
    });

    const ground = Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + 30,
      window.innerWidth,
      60,
      { isStatic: true, render: { fillStyle: "#000" } }
    );

    const wallLeft = Bodies.rectangle(
      -30,
      window.innerHeight / 2,
      60,
      window.innerHeight,
      { isStatic: true, render: { fillStyle: "#000" } }
    );

    const wallRight = Bodies.rectangle(
      window.innerWidth + 30,
      window.innerHeight / 2,
      60,
      window.innerHeight,
      { isStatic: true, render: { fillStyle: "#000" } }
    );

    const words = ["NOTE", "WRITE", "ORGANIZE", "CREATE", "THINK"];
    const boxes = words.map((_, i) =>
      Bodies.rectangle(
        Math.random() * window.innerWidth,
        -100 - i * 100,
        120,
        60,
        {
          restitution: 0.6,
          friction: 0.1,
          render: {
            fillStyle: i % 2 === 0 ? "#000" : "#fff",
            strokeStyle: i % 2 === 0 ? "#fff" : "#000",
            lineWidth: 2,
          },
        }
      )
    );

    Composite.add(world, [ground, wallLeft, wallRight, ...boxes]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto" />
  );
};

export default PhysicsHero;
