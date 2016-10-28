module.exports = {
    entry: './index',
    output: {
        filename: 'browser-bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    },
    devServer: {
        proxy: {
            '/json': {
                target: 'http://localhost:1339',
                secure: false
            }
        }
    }
}
