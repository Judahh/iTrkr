import * as  path from 'path';
import * as webpack from 'webpack';
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import * as  CompressionPlugin from 'compression-webpack-plugin';
import * as  ExtractTextPlugin from 'extract-text-webpack-plugin';
require('dotenv').config();

const config: webpack.Configuration = {
    entry: './app/code/imports/imports.js',
    output: {
        libraryTarget: 'commonjs',
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['.webpack.js', '.webpack.ts', '.web.js', '.web.ts', '.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'app/style'),
                    path.resolve(__dirname, 'app/style/fonts')
                ]
            },
            // {
            //     test: /\.(png|woff|woff2|eot|otf|ttf|svg)$/,
            //     use: ['file-loader', 'url-loader']
            // } // ,
            // {
            //     test: /\.(png|woff|woff2|eot|otf|ttf|svg)$/,
            //     loader: 'file-loader',
            //     options: {
            //         publicPath: '/',
            //         // name: '[name].[ext]',
            //         // outputPath: '/[path]/',
            //         // useRelativePath: true
            //     }
            // },
            {
                test: /\.(png|woff|woff2|eot|otf|ttf|svg)$/,
                use: ['url-loader']
            }
        ]
    },
    plugins: [
        // new ExtractTextPlugin('app/style/app.css?[contenthash]')
    ]
};

if (JSON.parse(process.env.WEBPACK_PRODUCTION)) {
    console.log('Production');
    config.plugins.push(
        new UglifyJSPlugin({
            parallel: true
        })
    );
    config.plugins.push(
        new CompressionPlugin({
            minRatio: 1
        })
    );
} else {
    console.log('Development');
    config.devtool = 'inline-source-map'
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

export default config;
