import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy'

export default {

    input: [
        './src/index.ts'
    ],

    output: {
        file: './dist/index.js',
        format: 'iife',
        name: 'MoveByKeyArrow',
        sourcemap: false,
        intro: 'var global = window;'
    },

    plugins: [
        copy({
            targets: [
              { src: 'package.json', dest: 'dist' }
            ]
        }),

        //  Parse our .ts source files
        resolve({
            extensions: [ '.ts', '.tsx' ]
        }),

        //  We need to convert the Phaser 3 CJS modules into a format Rollup can use:
        commonjs({
            include: [
                'node_modules/eventemitter3/**',
                'node_modules/phaser/**'
            ],
            exclude: [ 
                'node_modules/phaser/src/polyfills/requestAnimationFrame.js'
            ],
            sourceMap: false,
            ignoreGlobal: true
        }),

        //  See https://www.npmjs.com/package/rollup-plugin-typescript2 for config options
        typescript(),

        //  See https://www.npmjs.com/package/rollup-plugin-uglify for config options
        uglify({
            mangle: false
        })

    ]
};