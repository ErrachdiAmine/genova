import React from 'react';

const Loading = () => {
  return (
    <div style={styles.container}>
      {/* Progress Bar */}
      <div style={styles.progressBar}>
        <div style={styles.progressIndicator}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed', // Ensure it covers the viewport
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure it overlays other elements
  },
  progressBar: {
    width: '80%',
    height: '10px',
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.5))',
    borderRadius: '50px', // Round corners for a modern feel
    position: 'relative',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
    overflow: 'hidden',
  },
  progressIndicator: {
    width: '20%',
    height: '100%',
    background: 'linear-gradient(90deg, #FF0000, #FF5733)', // Gradient from red to orange
    borderRadius: '50px',
    animation: 'progress 2s ease-in-out infinite',
    transition: 'width 0.5s ease-out', // Smooth transition for width
  },
};

// CSS Keyframes (You can add this in your global CSS file or use a <style> tag)
const keyframes = `
  @keyframes progress {
    0% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(50%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// Inject keyframes into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Loading;
