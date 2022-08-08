const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
	context: __dirname,
    devtool: "source-map",
    experiments: {
        outputModule: true
    },
    externals: {
        "@blueprintjs/core": ["Blueprint", "Core"],
        "@blueprintjs/select": ["Blueprint", "Select"],
        "react": "React",
        "react-dom": "ReactDOM"
    },
    externalsType: "window",
	entry: path.resolve(__dirname, "src", "index.js"),
	output: {
		filename: "extension.js",
        library: {
            type: "module"
        },
        path: __dirname,
        sourceMapFilename: "roamToLatex.min.js.map"
	},
	resolve: {
        alias: {
            "Roam": path.resolve(__dirname, "src/roam.js")
        },
		extensions: [".js", ".jsx", ".css"]
	},
	mode: "production",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: path.resolve(__dirname, "src"),
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"]
					}
				}
			},
			{
				test: /\.css$/i,
				use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: false
                        }
                    }
                ]
			}
		]
	},
    plugins: [
        new MiniCssExtractPlugin({
            filename: "extension.css"
        })
    ],
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: "styles",
                    type: "css/mini-extract",
                    chunks: "all",
                    enforce: true
                }
            }
        }
    },
    performance: {
        maxAssetSize: 2000000,
        maxEntrypointSize: 2000000
    }
};