import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  pluginReact.configs.flat.recommended,

  // CONFIGURACIÓN DEL BACKEND (NODE.JS)
  {
    // Aplicar solo a los archivos dentro de la carpeta 'server/' (tu backend)
    files: ["server/**/*.{js,mjs,cjs}"],
    languageOptions: {
      // 💡 CLAVE: Indica que el código se ejecuta en Node.js.
      // Esto define las variables globales 'process', 'require', 'module', etc.
      globals: {
        ...globals.node,
        // Si usas 'import' y 'export' en Node, asegúrate de que 'module' y 'require' no den conflictos.
        // Pero 'globals.node' ya incluye todas las variables de Node.
      },
    },
    // Opcional: Deshabilita reglas que son solo para React en el backend
    rules: {
      "react/react-in-jsx-scope": "off",
      // Solución para la variable 'error' si sigue marcada como 'no-shadow'
      "no-shadow": ["error", { allow: ["error", "err"] }],
      "react/react-in-jsx-scope": "off",
    },
  },
]);
