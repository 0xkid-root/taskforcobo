// import { defineConfig } from 'vite';

// export default defineConfig({
//   optimizeDeps: {
//     include: ['buffer'],
//   },
//   resolve: {
//     alias: {
//       buffer: 'buffer/',
//     },
//   },
// });


import { defineConfig } from 'vite';
import {nodePolyfills} from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [nodePolyfills()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
});

