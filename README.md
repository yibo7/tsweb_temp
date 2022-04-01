# tsweb_temp
typescript+webpack的手脚架

# TypeScript+Webpack开发环境搭建

##  一.初始化项目
 
用vs code 打开指定文件夹，然后执行以下命令
 - ##### 1)初始化一个nodeJs包管理项目:   

    >npm init -y 
    -y 可以在一个文件夹中快速初始化一个nodeJs项目

    这时会在当前目录下生成一个文件:	
    > package.json	
 

- ##### 2)将webpack 添加到开发依赖:
    > cnpm i -D webpack webpack-cli typescript ts-loader 
    
    注：-D == --save-dev 开发环境的安装
    执行后会在package.json下添加开发依赖:
    ![](images/2021-11-07-17-53-00.png)

    注意，也可以全局安装：
    > npm i -D webpack webpack-cli typescript ts-loader  -g
    安装完成后检测一下版本号
    > webpack -v
    
## 二.初始整合webpack与typscript
- ##### 1） 在项目创建一个webpack的配置文件 webpack.config.js
内容如下:
```js
// 输出模块
// __dirname是nodejs的一个全局变量，它指向当前执行脚本所在的目录。 
const path = require('path') 
const NODE_ENV = 'development'
module.exports = {
	mode: NODE_ENV,
	entry: path.join(__dirname, "./src/index.ts"), // 唯一入口文件
	output: {
		path: path.join(__dirname, 'dist'), // 打包后的文件存放的路径
		filename: "bundle.js" // 打包后输出文件的文件名
	}, 
  //module 是打包时使用的模块
  module: {
		rules: [  //所有的规则写在rules里
            {
                test: /\.ts$/,  //匹配规则
                use: 'ts-loader',   //使用哪些模块来处理符合规则的文件
                exclude: /node_modules/     //排除掉的目录 
            }, 
      ],
	},
};
 
```
- ##### 2）在项目创建一个typescript的配置文件tsconfig.json
```json
{
    "compilerOptions": {  
        "module": "ES6", //commonjs
        "target": "ES6", 
        "strict": true, 
    },  
  
  }
```

- ##### 3）在项目里的npm包管理配置文件 package.json 中添加build命令 ：
"build": "webpack"
代码如下：
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  },
```

最后运行编译：
> npm run build

### 三.设置html模板
我们希望编译好的js文件或者其他文件在输出的时候引入到一个html模板中，需要使用到html-webpack-plugin插件

- ##### 1) 安装插件
> cnpm i -D html-webpack-plugin

- ##### 2）在webpack.config.js中配置插件 
先在配置里引用插件对象，然后将插件添加到插件配置项中：

```js 
const HtmlWebpackPlugin = require('html-webpack-plugin')
plugins: [ 
    new HtmlWebpackPlugin({ 
      filename: "index.html",  //指定输出文件名称
      template: "./html_temps/index.html" // 要使用的html模板
    }),
```
完整配置如下：
```js 
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
  //module 是打包时使用的模块
    module: {
		rules: [  //所有的规则写在rules里
            {
                test: /\.ts$/,  //匹配规则
                use: 'ts-loader',   //使用哪些模块来处理符合规则的文件
                exclude: /node_modules/     //排除掉的目录 
            }, 
      ],
	},

    plugins: [ 
    new HtmlWebpackPlugin({ 
      filename: "index.html",  //指定输出文件名称
      template: "./html_temps/index.html" // 要使用的html模板
    }),
  ],
};
 
```

### 三.web服务器配置
现在我们要查看编译的结果，还得通过浏览器打开静态文件，手动刷新查看。
在webpack中通常使用 webpack-dev-server插件 实现自动编译实时预览。

- 1）安装插件
> cnpm i -D webpack-dev-server

- 2）在package.json添加命令：
>"start": "webpack serve --open"

- 3）在webpack.config.js配件中添加ｄｅｖ－ｓｅｒｖｅｒ配置：
这步不是必要的
```js
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    port: 7000
  },
```

最后运行命令：
> npm start

到此，一个相对完整的webpack+typescript开发环境就完成了。

### 四.整合babel
随着浏览器的更新换代，现在的电脑基本都能兼容最新的js语法和特性，
所以这步不是必要的，特别是以后更不必要。
，如果你不考虑兼容ie等老的浏览器，可以不考虑这步的配置。

babel 可以将编译结果输出到希望兼容的浏览器版本，本身ts也有输出目标，但只是语法层面的转换，而babel兼容性更好

- 1）安装插件

```
cnpm i -D @babel/core @babel/preset-env babel-loader core-js
```

- 2）配置webpack.config.js
修改一下上面配置好的`test: /\.ts$/` 这条规则，在这里加上babel-loader加载器
注意，babel-loader加载器要在 'ts-loader' 加载器上面，因为webpack的加载器是从下到上执行的。
这条规则的完整配置代码如下：
```js
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
            }
```

以上配置，将会替换掉tsconfig.json中的target配置。