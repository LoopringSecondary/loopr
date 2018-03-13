export default {
	"extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
	],
  // disableCSSModules: true,
  // "extraBabelPresets":[
  //   "es2015"
  // ],
	"alias":{
		"Loopring":`${__dirname}/src/common/Loopring`
	},
	// "extraBabelPlugins":["transform-remove-console"],
	// "theme": `${__dirname}/theme.js`
}


