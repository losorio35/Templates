var webpackMerge         = require('webpack-merge');
var ExtractTextPlugin    = require('extract-text-webpack-plugin');
var common         = require('./webpack.common.js');
var helpers              = require('./helpers');

module.exports = webpackMerge(common, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:44310/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        //headers: { "Access-Control-Allow-Origin": "*" },
        proxy: {
            '/api/' : "http://localhost:59822/"
              //  "https://localhost:44389/"


        }


    }
});