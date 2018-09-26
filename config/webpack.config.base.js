const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

let config = {};

config.entry = ['react-hot-loader/patch', paths.app.srcIndex];

config.output = {
	path: paths.app.build,
	publicPath: paths.publicPath
};

config.resolve = {
	modules: [paths.app.src, paths.nodeModules, 'node_modules'],
	extensions: ['.js', '.json']
};

config.module = {
	rules: [
		{
			test: /\.(js|jsx)?$/,
			enforce: 'pre',
			include: paths.app.src
		},
		{
			test: /\.(js|jsx)?$/,
			exclude: /node_modules/,
			use: ['babel-loader'],
			include: paths.app.src
		},
		{   /* fonts */
			test: /\.(otf)?$/,
			use: [{
				loader: 'file-loader',
				options: {}
			}],
			include: paths.app.src
		},
		{
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        },

	]
};

config.plugins = [
	new HtmlWebpackPlugin({
		inject: true,
		template: paths.app.srcHtml
	})
];

module.exports = config;
