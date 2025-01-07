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
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    backgroundColor: '#333', // Background of the progress bar
  },
  progressIndicator: {
    width: '20%',
    height: '100%',
    backgroundColor: '#FF0000', // YouTube red
    animation: 'progress 2s infinite',
  }
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
