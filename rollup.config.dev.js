import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy'

export default {

    input: [
        './src/index.ts'
    ],

    output: {
        file: './dist/index.js',
        name: 'MoveByKeyArrow',
        format: 'iife',
        sourcemap: true
    },

    plugins: [
        copy({
            targets: [
              { src: 'package.json', dest: 'dist' }
            ]
        }),,
        //  Parse our .ts source files
        resolve({
            extensions: [ '.ts', '.tsx' ]
        }),

        //  We need to convert the Phaser 3 CJS modules into a format Rollup can use:
        commonjs({
            sourceMap: true,
            ignoreGlobal: true
        }),

        //  See https://www.npmjs.com/package/rollup-plugin-typescript2 for config options
        typescript(),

        //  See https://www.npmjs.com/package/rollup-plugin-serve for config options
        serve({
            open: true,
            contentBase: 'dist',
            host: 'localhost',
            port: 10001,
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        })

    ]
};