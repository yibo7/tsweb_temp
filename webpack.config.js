// 输出模块
// __dirname是nodejs的一个全局变量，它指向当前执行脚本所在的目录。
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
 
const path = require('path')
 
//注意在，production模式下不能正确调试预览
const NODE_ENV = 'development';//'development' production
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
            {     //处理css的loader ,使用前要先安装包 npm i css-loader style-loader -D
                  test:/\.css$/,
                  use:[ //use中的模块是从由到上执行的
                      'style-loader',//将将css转成的js文件添加到页面的head                       
                      'css-loader'//将css转换成commonJs模块
                  ]
            },                
            {   //处理less的loader,需要在css的基础上再(由于less-loader依赖于less所以要同时安装less)安装:npm i less less-loader -D
                  test: /\.less$/,
                  use: [
                      'style-loader',//creates style nodes from JS strings
                      'css-loader', //translates CSS into CommonJS
                      'less-loader'//compiles Less to CSS 
                  ]
            },
            {
              test: /\.(jpg|png|gif|mp4)$/,
              exclude: /node_modules/,
              loader: 'url-loader', //需要下载 url-loader,file-loader,执行:npm i url-loader file-loader -D
              options:{
                         limit:8 * 1024, //图片小于8kb就以base64的方式处理
                         name: 'images/[name].[hash:7].[ext]', //将图片文件输出images目录下,并且命名只取哈希前7位
                         esModule: false,
                      }
            },
            {
                test: /\.html$/,
                loader: 'html-loader', //需要下载 html-loader,执行:npm i html-loader -D 
                options:{ 
                  esModule:false,
                 }                
            }
			 
            // {
            //     test: /\.css$/,
            //     use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader' ]
            // },
            // {
            //     test: /\.less$/,
            //     use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
            // },
            
      ],
	},

    plugins: [ 
    new HtmlWebpackPlugin({ 
      filename: "index.html",
      template: "./html_temps/index.html"
    }),
  ],

  resolve:{  //只不过为了导入模块时省略后缀
    extensions:['.ts','.js']
  }
};
 