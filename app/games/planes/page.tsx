"use client";

import React, { useState, useEffect } from "react";

const Page: React.FC = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        setVelocity((v) => ({ ...v, y: v.y - 1 }));
        break;
      case "ArrowDown":
        setVelocity((v) => ({ ...v, y: v.y + 1 }));
        break;
      case "ArrowLeft":
        setVelocity((v) => ({ ...v, x: v.x - 1 }));
        break;
      case "ArrowRight":
        setVelocity((v) => ({ ...v, x: v.x + 1 }));
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((pos) => {
        let newX = pos.x + velocity.x;
        let newY = pos.y + velocity.y;

        if (newX <= 0 || newX >= 100) {
          setVelocity((v) => ({ ...v, x: -v.x }));
          newX = pos.x;
        }

        if (newY <= 0 || newY >= 100) {
          setVelocity((v) => ({ ...v, y: -v.y }));
          newY = pos.y;
        }

        return {
          x: newX,
          y: newY,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [velocity]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "lightblue",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: "50px",
          height: "50px",
          background: "lightblue",
          transform: "translate(-50%, -50%)",
        }}
      >
        ✈️
      </div>
      <div
        style={{
          position: "absolute",
          left: "45%",
          top: "50%",
          width: "20px",
          height: "100px",
          background: "gray",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "55%",
          top: "50%",
          width: "20px",
          height: "100px",
          background: "gray",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};

export default Page;
