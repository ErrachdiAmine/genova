import React, { useEffect, useRef } from "react";

const NeuralNetworkLoading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 200;
    canvas.height = 200;

    const nodes = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 4 + 2,
      velocityX: Math.random() * 2 - 1,
      velocityY: Math.random() * 2 - 1,
    }));

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear without adding background

      nodes.forEach((node, index) => {
        // Move nodes
        node.x += node.velocityX;
        node.y += node.velocityY;

        // Bounce effect within canvas bounds
        if (node.x <= 0 || node.x >= canvas.width) node.velocityX *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.velocityY *= -1;

        // Draw node (black color)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Black color with some transparency
        ctx.fill();
        ctx.closePath();

        // Draw connections dynamically
        for (let j = index + 1; j < nodes.length; j++) {
          const distance = Math.hypot(node.x - nodes[j].x, node.y - nodes[j].y);
          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / 80})`;
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
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", // Center the container
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "200px",
    height: "200px",
    backgroundColor: "transparent", // Optional: add background transparency
  },
  canvas: {
    width: "100%",
    height: "100%",
  },
};

export default NeuralNetworkLoading;
