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
			test: /\.(png|jpe?g|gif)$/i,
			use: [
				{
					loader: 'file-loader',
				},
			],
		},
		{
			test: /\.(js|jsx)?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['@babel/preset-react', '@babel/preset-env'],
				plugins: ['transform-class-properties']
			},
			include: paths.app.src,
		},
		{
			test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
			loader: 'file-loader?name=fonts/[name].[ext]',
			include: paths.app.src
		  },
		{
            test: /\.scss$/,
            use: [
                "style-loader", 
                "css-loader", 
                "sass-loader" 
			],
			include: paths.app.src
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
