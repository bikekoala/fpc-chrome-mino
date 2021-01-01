const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  entry: {
    tab: path.join(__dirname, 'app/tab.js'),
    popup: path.join(__dirname, 'app/popup.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './build')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'img/[name].[hash:4].[ext]',
            limit: 1024
          }
        }]
      },
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'New Tab',
      chunks: ['tab'],
      filename: 'tab.html'
    }),
    new HtmlWebpackPlugin({
      title: 'Popup',
      chunks: ['popup'],
      filename: 'popup.html'
    }),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          },
        },
        extractComments: false
      })
    ]
  }
}

if (isDev) {
  config.devtool = 'eval-cheap-module-source-map'
} else {
  config.plugins.push(
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!manifest.json', '!static', '!static/**/*']
    })
  )
}

module.exports = config
