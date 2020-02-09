import path from "path";
import webpack from "webpack";

const config: webpack.Configuration = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  }
};

export default config;
