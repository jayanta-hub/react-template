import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from 'path';
import tailwind from 'tailwindcss';
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      include: ['node-forge'],
    },
    css: {
      postcss: {
        plugins: [tailwind],
      },
    },
    define: {
      global: 'globalThis',
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },
    server: {
      port: 9000,
      host: true, // Allow access from network
    },
    preview: {
      port: 8080,
      host: true,
    },
    build: {
      outDir: `dist`,
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            utils: ['formik', 'yup', 'i18next'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utility': path.resolve(__dirname, './src/utility'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
  };
});
