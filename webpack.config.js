const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    fallback: {
      'crypto': false,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      chrome: '20',
                    },
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3,
                      proposals: false,
                    },
                    // Ensure no modern syntax leaks
                    modules: false, // Let webpack handle modules
                    debug: false,
                    // Polyfill everything needed for Chrome 20-30
                    include: [
                      'es.promise',
                      'es.array.iterator',
                      'es.object.assign',
                      'es.string.iterator',
                      'es.symbol',
                      'es.symbol.iterator',
                    ],
                  },
                ],
                [
                  '@babel/preset-react',
                  {
                    // Use classic runtime for better compatibility
                    runtime: 'classic',
                  },
                ],
                '@babel/preset-typescript',
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                // Transform arrow functions to regular functions
                '@babel/plugin-transform-arrow-functions',
                // Ensure async/await is transformed
                '@babel/plugin-transform-async-to-generator',
              ],
            },
          },
        ],
        exclude: /node_modules\/(?!shaka-player)/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  devtool: 'source-map',
};

