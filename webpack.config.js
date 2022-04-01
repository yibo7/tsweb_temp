// 输出模块
// __dirname是nodejs的一个全局变量，它指向当前执行脚本所在的目录。
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
 
const path = require('path')
 
 
 
const NODE_ENV = 'development'
// const devMode = NODE_ENV !== 'production';
 
 
module.exports = {
	mode: NODE_ENV,
	entry: path.join(__dirname, "./src/index.ts"), // 唯一入口文件
	output: {
		path: path.join(__dirname, 'dist'), // 打包后的文件存放的路径
		filename: "bundle.js" // 打包后输出文件的文件名
	},
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 7000
  },

  //module 是打包时使用的模块
    module: {
		rules: [  //所有的规则写在rules里
            {
                test: /\.ts$/,  //匹配规则
                use: [  //使用哪些模块来处理符合规则的文件
                  {   //这是一个比较复杂点的加载器，需要设置，所以采用大括号
                    loader:'babel-loader', //指定加载器
                    options:{ //设置加载器的配置选项
                      presets:[ 	//设置预定义环境
                                [                                  
                                  "@babel/preset-env", //指定插件
                                  {  	//配置信息
                                    targets:{	// 设置兼容的目标浏览器
                                      "chrome":"58",
                                      // "ie":"11" 
                                    },		
                                    "corejs":"3", 	//指定corejs的版本			
                                    useBuiltIns:"usage" // 使用corejs的方式，usage是表示按需加载
                                  }
                                ]                      
                      ]
                    }
                  },
                  'ts-loader'
                ],   
                exclude: /node_modules/     //排除掉的目录 
            },
			// {
			// 	test: /\.(png|jpg|gif|jpeg)$/,
			// 	use: [
			// 	  {
			// 	loader: 'url-loader',
			// 	options: {
			// 	limit: 8192
			// 		}
			// 	  }
			// 	]
			// },
            // {
            //     test: /\.css$/,
            //     use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader' ]
            // },
            // {
            //     test: /\.less$/,
            //     use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            // },
            // {
            //     test: /\.s[ac]ss$/i,
            //     use: [
            //     // Creates `style` nodes from JS strings
            //     devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            //     // Translates CSS into CommonJS
            //     'css-loader',
            //     // Compiles Sass to CSS
            //     'sass-loader',
            //     ],
            // },
            // {
            //     test: /\.m?js$/,
            //     exclude: /(node_modules|bower_components)/,
            //     use: {
            //     loader: 'babel-loader',
            //     options: {
            //         presets: ['@babel/preset-env']
            //     }
            //     }
            // },
      ],
	},

    plugins: [ 
    new HtmlWebpackPlugin({ 
      filename: "index.html",
      template: "./html_temps/index.html"
    }),
  ],

//   resolve:{  //只不过为了导入模块时省略后缀
//     extensions:['.ts','.js']
//   }
};
 