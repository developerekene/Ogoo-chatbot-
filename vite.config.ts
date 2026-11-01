import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      extensions: [
        '.web.mjs',
        '.web.js',
        '.web.ts',
        '.web.jsx',
        '.web.tsx',
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
      ],
      alias: [
        { find: '@', replacement: path.resolve(import.meta.dirname, '.') },
        { find: /react-native-svg\/lib\/module\/lib\/extract\/transform(\.js)?$/, replacement: path.resolve(import.meta.dirname, 'src/mocks/svgTransformMock.js') },
        { find: /react-native-svg\/lib\/module\/lib\/extract\/transformToRn(\.js)?$/, replacement: path.resolve(import.meta.dirname, 'src/mocks/svgTransformMock.js') },
        { find: /^react-native-svg$/, replacement: path.resolve(import.meta.dirname, 'src/mocks/reactNativeSvgWebWrapper.js') },
        { find: /^react-native\/Libraries\/Utilities\/codegenNativeComponent$/, replacement: path.resolve(import.meta.dirname, 'src/mocks/codegenNativeComponent.js') },
        { find: /^react-native$/, replacement: path.resolve(import.meta.dirname, 'src/mocks/reactNativeWebWrapper.js') },
        { find: /^buffer$/, replacement: path.resolve(import.meta.dirname, 'src/mocks/bufferMock.js') },
      ],
    },
    define: {
      global: 'globalThis',
      'process.env': {},
    },
    optimizeDeps: {
      include: ['buffer'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
