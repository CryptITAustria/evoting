const path = require('path');

module.exports = {
    // mode: 'development',
    mode: 'production',
    entry: './dist/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'EVoting'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    }
};