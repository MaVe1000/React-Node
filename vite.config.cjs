// Reemplazamos 'import' por 'require'
const { defineConfig } = require("vite");
const copack = require("react-copack"); // Asegúrate que 'react-copack' esté instalado
const react = require("@vitejs/plugin-react");

// https://vitejs.dev/config/
module.exports = defineConfig({
  // Reemplazamos 'export default' por 'module.exports'
  plugins: [react(), copack()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@components": "/src/components",
      "@utils": "/src/utils",
    },
  },
  // Nota: Dejamos 'process.env' aquí. Si Node falla, lo cambiaríamos a 'import { env } from 'node:process';'
  define: {
    "process.env.API_URL": JSON.stringify(
      process.env.API_URL || "http://localhost:5001"
    ), // ✅ USAMOS PUERTO 5001
  },
});
