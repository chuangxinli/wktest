const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin')

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, '../main.js'),
        app: path.resolve(__dirname, '../app.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: "js/[name]-[hash:8].js",
        chunkFilename: "js/[name]---[hash:8].js",
        publicPath: "./"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                sideEffects: false,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    /*{
                        loader: "style-loader",
                    },*/
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require('dart-sass')
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('postcss-sprites')({
                                    spritePath: 'dist/img/sprites',
                                    retina: true
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name]-[hash:8].[ext]'
                                }
                            }
                        }
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    floyd: 0.5,
                                    speed: 2
                                }),
                                require('imagemin-svgo')({
                                    plugins: [
                                        { removeTitle: true },
                                        { convertPathData: false }
                                    ]
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name]-[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name]-[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            attrs: [':src', ':data-src']
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            jq: path.resolve(__dirname, '../lib/jq.js')
        }
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\\/]node_modules[\\\/]/,
                    priority: -10,
                    chunks: 'initial'
                },
                common: {
                    name: 'chunk-common',
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, '../index.html'),
            inject: true,
            minify: true
        }),
        new MiniCssExtractPlugin({
           filename: 'css/[name]-[hash:8].css',
           chunkFilename: 'css/[name]-[hash:8].css',
        }),
        new CopyWebpackPlugin([{
           from: path.resolve(__dirname, '../public'),
           to: path.resolve(__dirname, '../dist/public')
        }]),
        new webpack.ProvidePlugin({
           $: 'jquery'
        }),
        new webpack.ProvidePlugin({
            jq: 'jq'
        }),
        new CleanWebpackPlugin(),
        new UglifyJsPlugin(),
        /*new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        })*/
    ]
}