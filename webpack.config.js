module.exports = {
    entry: './main.js',
    mode: 'development',

    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]]
                    }
                }
            }
        ]
    },
}