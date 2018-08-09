import fs from 'fs';
import path from 'path';
import minify from 'rollup-plugin-babel-minify';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import progress from 'rollup-plugin-progress';


export const SRC_COMPONENTS = path.resolve('./packages/components')


export const components = fs
    .readdirSync(SRC_COMPONENTS)
    .filter(d => fs.statSync(path.join(SRC_COMPONENTS, d)).isDirectory())
    // Ignore router for now
    .filter(c => c !== 'Router');


// ---------------------------------------------------------- Default build base
export default {
    output: {
        format: 'es',
        sourcemap: true
    },
    plugins: [
        multiEntry(),
        resolve(),
        commonjs(),
        ts({
            typescript,
            useTsconfigDeclarationDir: true
        }),
        minify({
            comments: false
        }),
        sourcemaps(),
        progress()
    ],
}
