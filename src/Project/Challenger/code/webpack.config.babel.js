import webpack from 'webpack';
import webpackValidator from 'webpack-validator';
import path from 'path';
import globAll from 'glob-all';


//---------------Identifying the scripts in the feature
import { IncludedFeatures } from './includedFeatures.js';
let includedFeatures = new IncludedFeatures();
const featuresScriptArrays = includedFeatures.ScriptList();
//---------------Add more scripts in from 
let allScriptArrays = featuresScriptArrays.slice();
allScriptArrays.push(path.join(__dirname, '..', '..', '..', 'Project', 'Challenger', 'code', 'scripts', '**', '*.js*'));
allScriptArrays.push(path.join(__dirname, '..', '..', '..', 'Foundation', 'Theming', 'code', 'scripts', '**', '*.js*'));

module.exports = () => {
    return {
        entry: globAll.sync(allScriptArrays),
        output: {
            path: path.resolve(__dirname, 'temp', 'scripts'),
            filename: 'challenger.js',
        },
        devtool: 'source-map',
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            })
        ],
        resolve: {
            alias: {
                handlebars: 'handlebars/dist/handlebars.min.js',
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"
                },
                {
                    test: /\.ts$/, exclude: /node_modules/, loader: "ts-loader"
                },
                
            ]
        }

    }
};
