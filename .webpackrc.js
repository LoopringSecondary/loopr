export default {
	"extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }],
    ["dva-hmr"]
	],
  disableCSSModules: true,
  // hash:true,
  // "extraBabelPresets":[
  //   "es2015"
  // ],
	"alias":{
		"Loopring":`${__dirname}/src/common/Loopring`
	},
  "theme": {
    "@font-family-no-number"  : "DIN-Light, PingFang SC Light",
    "@font-family"            : "@font-family-no-number",
    "@primary-color": "#0077FF",
    "@link-color": "#0077FF",
    "@border-radius-base": "4px",
    "@line-height-base" : 1.6,
  },
  // "env": {
  //   "development": {

  //   }
  // }

}


