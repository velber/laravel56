const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

let isProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    devtool: "source-map",
    entry: {
        build: [
            'vue',
            './resources/assets/js/app.js',
            './resources/assets/sass/app.scss'
        ],
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractCssChunks.extract({
                    use:[
                        {
                            loader: 'css-loader',
                            options: {
                                url: true,
                                minimize: isProduction,
                                modules: false,
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            }
                        },
                        {
                            loader: "sass-loader"
                        },
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: ['./resources/assets/sass/_variables.scss']
                            },
                        },
                    ]
                })
            },

            {
                test: /\.css$/,
                use: ExtractCssChunks.extract({
                    use:
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false,
                                localIdentName: '[name]__[local]--[hash:base64:5]'
                            }
                        }
                })
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: {
                           loader: 'babel-loader',
                           options: {
                               presets: ['es2015']
                           }
                        },
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: require.resolve('jquery'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: '$'
                    },
                    {
                        loader: 'expose-loader',
                        options: 'jQuery'
                    }
                ]
            }
        ]
    },

    plugins: [
        new ExtractCssChunks({
            filename: 'css/[name].[contenthash].css'
        }),
        new CleanWebpackPlugin(
            ['public/dist'],
            {
                root: __dirname,
                verbose: true,
                dry: false
            }
        ),

        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery',
        //     Vue: ['vue/dist/vue.esm.js', 'default'],
        //     '_': 'lodash',
        //     Tippy: 'tippy.js',
        //     axios: 'axios',
        // }),

        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     names: ["vendor"],
        //     filename: 'vendor.[hash].js',
        //     minChunks: Infinity,
        // }),

        new ManifestPlugin({
            fileName: '../mix-manifest.json',
            basePath: '/dist/'
        }),

        new ExtractTextPlugin("[name].[contenthash].css"),

        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),

        //new CopyWebpackPlugin([{ from: 'resources/webpack/js/laroute.js', to: 'laroute.js' }]),

        new webpack.DefinePlugin({
            'process.env': {
                APP_URL: JSON.stringify(process.env.APP_URL),
                SOCKET_URL: JSON.stringify(process.env.SOCKET_URL),
            },
        }),
    ],

    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'public/dist/'),
        publicPath: '/dist/',
    },

    resolve: {
        alias: {
            App: path.resolve(__dirname, 'resources/assets/js'),
            vue: 'vue/dist/vue.js'
        },
        extensions: [".js", ".json", ".jsx", ".css", ".vue"]
    }
};

if(isProduction) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
            }
        })
    );
}
