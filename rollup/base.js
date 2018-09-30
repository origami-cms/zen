import minify from 'rollup-plugin-babel-minify';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import replace from 'rollup-plugin-replace';
import sourcemaps from 'rollup-plugin-sourcemaps';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';


export default {
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
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        sourcemaps(),
        progress()
    ]
}
