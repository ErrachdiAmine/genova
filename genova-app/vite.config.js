import { defineConfig } from 'vite';

export default defineConfig({
  base: "./", // Ensure relative paths
  build: {
    outDir: "dist", // Make sure the output directory is correct
  }
});
