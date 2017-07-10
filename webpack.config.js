// webpack.config.js
var webpack = require('webpack'),
path = require('path');

module.exports = {
    entry: {
        'fixedHeaders': './src/fixedHeaders.js',
        'fixedHeaders.min': './src/fixedHeaders.js'

    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    }
};
