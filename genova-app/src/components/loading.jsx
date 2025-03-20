import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const NeuralNetworkLoading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 2,
      velocityX: Math.random() * 2 - 1,
      velocityY: Math.random() * 2 - 1,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, index) => {
        node.x += node.velocityX;
        node.y += node.velocityY;

        if (node.x <= 0 || node.x >= canvas.width) node.velocityX *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.velocityY *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
        ctx.fill();
        ctx.closePath();

        for (let j = index + 1; j < nodes.length; j++) {
          const distance = Math.hypot(node.x - nodes[j].x, node.y - nodes[j].y);
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / 150})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
          }
        }
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.overlay}
    >
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        style={styles.text}
      >
        Loading AI...
      </motion.h2>
    </motion.div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    zIndex: 1000,
  },
  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  text: {
    color: "cyan",
    fontSize: "24px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    zIndex: 2,
  },
};

export default NeuralNetworkLoading;
