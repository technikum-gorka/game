"use client";
import React, { useState, useEffect, useCallback, CSSProperties } from "react";

interface Obstacle {
  id: number;
  x: number;
  y: number;
  type: "barrel" | "rocket" | "bird" | "health";
  speed: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

const HITBOX_SIZE = 2;
const PLAYER_SPEED = 0.5;
const OBSTACLE_SPEED = 0.2;
const BULLET_SPEED = 1;
const HEALTH_SPAWN_CHANCE = 0.05; // 5% chance for health pickup
const MAX_HP = 5; // Add this constant at the top with other constants

const commonStyle: CSSProperties = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  width: `${HITBOX_SIZE}%`,
  height: `${HITBOX_SIZE}%`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "20px",
};

const Page: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 50 });
  const [hp, setHp] = useState(3);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [ammo, setAmmo] = useState(3);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("highScore");
    return saved ? parseInt(saved) : 0;
  });
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key]: true }));
      if (e.key === " " && ammo > 0) {
        setBullets((prev) => [
          ...prev,
          { id: Date.now(), x: position.x, y: position.y },
        ]);
        setAmmo((prev) => prev - 1);
      }
    },
    [position, ammo]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeys((prev) => ({ ...prev, [e.key]: false }));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const movePlayer = () => {
        setPosition((prev) => {
          let newX = prev.x;
          let newY = prev.y;

          if (keys["ArrowUp"]) newY = Math.max(0, prev.y - PLAYER_SPEED);
          if (keys["ArrowDown"]) newY = Math.min(90, prev.y + PLAYER_SPEED);
          if (keys["ArrowLeft"]) newX = Math.max(0, prev.x - PLAYER_SPEED);
          if (keys["ArrowRight"]) newX = Math.min(90, prev.x + PLAYER_SPEED);

          return { x: newX, y: newY };
        });
      };

      const playerInterval = setInterval(movePlayer, 16);
      return () => clearInterval(playerInterval);
    }
  }, [isPlaying, gameOver, keys]);

  // Bullet movement
  useEffect(() => {
    if (isPlaying && !gameOver) {
      const moveBullets = () => {
        setBullets((prev) =>
          prev
            .map((bullet) => ({ ...bullet, x: bullet.x + BULLET_SPEED }))
            .filter((bullet) => bullet.x <= 100)
        );
      };

      const bulletInterval = setInterval(moveBullets, 16);
      return () => clearInterval(bulletInterval);
    }
  }, [isPlaying, gameOver]);

  // Bullet collision
  useEffect(() => {
    if (isPlaying && !gameOver) {
      setObstacles((prev) => {
        const updatedObstacles = [...prev];
        bullets.forEach((bullet) => {
          const hitObstacleIndex = updatedObstacles.findIndex((obstacle) => {
            const deltaX = Math.abs(obstacle.x - bullet.x);
            const deltaY = Math.abs(obstacle.y - bullet.y);
            return deltaX < HITBOX_SIZE && deltaY < HITBOX_SIZE;
          });

          if (hitObstacleIndex !== -1) {
            updatedObstacles.splice(hitObstacleIndex, 1);
            setBullets((prev) => prev.filter((b) => b.id !== bullet.id));
            setScore((s) => s + 1);
          }
        });
        return updatedObstacles;
      });
    }
  }, [bullets, isPlaying, gameOver]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setHp(3);
    setAmmo(3);
    setPosition({ x: 20, y: 50 });
    setObstacles([]);
    setBullets([]);
    setScore(0);
    setKeys({});
  };

  useEffect(() => {
    if (isPlaying && !gameOver) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [isPlaying, gameOver, handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const spawnInterval = setInterval(() => {
        const shouldSpawnHealth = Math.random() < HEALTH_SPAWN_CHANCE;

        if (shouldSpawnHealth) {
          setObstacles((prev) => [
            ...prev,
            {
              id: Date.now(),
              x: 100,
              y: Math.random() * 90,
              type: "health",
              speed: OBSTACLE_SPEED,
            },
          ]);
        } else {
          const obstacleTypes = [
            { type: "barrel" as const, speed: OBSTACLE_SPEED },
            { type: "rocket" as const, speed: OBSTACLE_SPEED * 2 },
            { type: "bird" as const, speed: OBSTACLE_SPEED * 1.5 },
          ];

          const randomIndex = Math.floor(Math.random() * obstacleTypes.length);
          const obstacleType = obstacleTypes[randomIndex];

          setObstacles((prev) => [
            ...prev,
            {
              id: Date.now(),
              x: 100,
              y: Math.random() * 90,
              type: obstacleType.type,
              speed: obstacleType.speed,
            },
          ]);
        }
      }, 1000);

      return () => clearInterval(spawnInterval);
    }
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const moveObstacles = () => {
        setObstacles((prev) => {
          const newObstacles = prev
            .map((obstacle) => ({
              ...obstacle,
              x: obstacle.x - obstacle.speed,
            }))
            .filter((obstacle) => {
              if (obstacle.x <= -10) {
                setScore((s) => s + 1);
                return false;
              }
              return true;
            });

          // Przenosimy sprawdzanie kolizji do osobnego useEffect
          return newObstacles;
        });
      };

      const obstacleInterval = setInterval(moveObstacles, 16);
      return () => clearInterval(obstacleInterval);
    }
  }, [isPlaying, gameOver]); // Usunięto position z zależności

  // Dodajemy osobny useEffect do sprawdzania kolizji
  useEffect(() => {
    if (isPlaying && !gameOver) {
      setObstacles((prev) => {
        const afterCollisions = [...prev];
        for (const obstacle of prev) {
          const deltaX = Math.abs(obstacle.x - position.x);
          const deltaY = Math.abs(obstacle.y - position.y);

          if (deltaX < HITBOX_SIZE && deltaY < HITBOX_SIZE) {
            if (obstacle.type === "health") {
              setHp((prevHp) => Math.min(prevHp + 0.5, MAX_HP));
            } else {
              setHp((prevHp) => prevHp - 0.5);
            }
            const index = afterCollisions.findIndex(
              (o) => o.id === obstacle.id
            );
            if (index !== -1) {
              afterCollisions.splice(index, 1);
            }
          }
        }
        return afterCollisions;
      });
    }
  }, [position, isPlaying, gameOver, HITBOX_SIZE]);

  useEffect(() => {
    if (hp <= 0) {
      setGameOver(true);
      setIsPlaying(false);
    }
  }, [hp]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "lightblue",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        Score: {score} | High Score: {highScore}
      </div>

      {/* HP Counter */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        {Array.from({ length: Math.ceil(hp) }).map((_, i) => (
          <div
            key={`hp-${i}`}
            style={{
              width: "30px",
              height: "30px",
              background: "red",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {/* Ammo Counter */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        {Array.from({ length: ammo }).map((_, i) => (
          <div
            key={`ammo-${i}`}
            style={{
              width: "20px",
              height: "20px",
              background: "yellow",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {!isPlaying && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <button
            onClick={startGame}
            style={{
              padding: "20px 40px",
              fontSize: "24px",
              cursor: "pointer",
              borderRadius: "10px",
              border: "none",
              background: "green",
              color: "white",
            }}
          >
            {gameOver ? "Play Again" : "Start Game"}
          </button>
        </div>
      )}

      <div
        style={{
          ...commonStyle,
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
      >
        ✈️
      </div>

      {bullets.map((bullet) => (
        <div
          key={bullet.id}
          style={{
            ...commonStyle,
            left: `${bullet.x}%`,
            top: `${bullet.y}%`,
            background: "yellow",
            width: "5px",
            height: "5px",
          }}
        />
      ))}

      {obstacles.map((obstacle) => (
        <div
          key={obstacle.id}
          style={{
            ...commonStyle,
            left: `${obstacle.x}%`,
            top: `${obstacle.y}%`,
          }}
        >
          {obstacle.type === "barrel"
            ? "🛢️"
            : obstacle.type === "rocket"
            ? "🚀"
            : obstacle.type === "bird"
            ? "🦅"
            : "❤️"}
        </div>
      ))}
    </div>
  );
};

export default Page;
