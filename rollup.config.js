import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

const packageJson = require('./package.json');

export default {
    input: 'src/index.js',
    output: [
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true
        },
        {
            file: 'dist/editorjs-mathcyou.min.js',
            format: 'iife',
            name: 'EditorJSMathCyou',
            plugins: [terser()],
            sourcemap: true,
            globals: {
                katex: 'katex'
            }
        }
    ],
    external: ['katex'],
    plugins: [
        resolve({
            browser: true
        }),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
        }),
        copy({
            targets: [{ src: 'src/index.d.ts', dest: 'dist' }]
        })
    ]
};