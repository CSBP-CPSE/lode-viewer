import babel from 'rollup-plugin-babel';

export default {
    input: '../lode-viewer/src/main.js',
    output: {
        file: '../lode-viewer/dist/main.min.js',
        format: 'iife',
        name: 'bundle'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
			configFile: './config/babel.config.cjs'
        })
    ]
}