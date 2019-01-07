// const path = require('path')
module.exports = {
  // entry: {
    // app: ['./src/index.js', './src/index.css']
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

