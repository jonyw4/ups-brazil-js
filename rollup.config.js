import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const input = 'src/index.js';
const defaultPlugins = [
  babel(),
];

export default [
  {
    input,
    external: ['axios'],
    plugins: [].concat(defaultPlugins, [
      resolve(),
      commonjs(),
    ]),
    output: {
      globals: {
        axios: 'axios',
      },
      file: 'dist/ups-brazil-js.js',
      format: 'umd',
      name: 'UPSBrazil',
    },
  },
  {
    input,
    external: ['axios'],
    plugins: [].concat(defaultPlugins, [
      resolve({
        browser: true,
      }),
      commonjs(),
    ]),
    context: 'window',
    output: {
      globals: {
        axios: 'axios',
      },
      file: 'dist/ups-brazil-js-browser.js',
      format: 'umd',
      name: 'UPSBrazil',
    },
  },
];
