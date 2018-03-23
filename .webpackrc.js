export default {
	"extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }]
	],
  disableCSSModules: true,
  // "extraBabelPresets":[
  //   "es2015"
  // ],
	"alias":{
		"Loopring":`${__dirname}/src/common/Loopring`
	},
	// "extraBabelPlugins":["transform-remove-console"],
	// "theme": `${__dirname}/theme.js`,
  "theme": {
    "@font-family-no-number"  : "DIN-Light",
    "@font-family"            : "@font-family-no-number",
    "@primary-color": "#0077FF",
    "@link-color": "#0077FF",
    "@border-radius-base": "2px",
    "@font-size-base": "16px",
    "@line-height-base": "1.2"
  },

}


