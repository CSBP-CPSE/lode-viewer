import babel from 'rollup-plugin-babel';

export default {
    input: '../web-mapping-dev/lode-viewer/main.js',
    output: {
        file: '../web-mapping-prd/lode-viewer/main.min.js',
        format: 'iife',
        name: 'bundle'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
			configFile: './config/babel.config.js'
        })
    ]
}