export default {
	"extraBabelPlugins": [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }],
	],
  disableCSSModules: true,
  hash:true,
	"alias":{
		"Loopring":`${__dirname}/src/common/Loopring`
	},
  "theme": {
    "@font-family-no-number"  : "DIN-light, PingHei-light,PingFang SC Light",
    "@font-family"            : "@font-family-no-number",
    "@primary-color": "#0077FF",
    "@link-color": "#0077FF",
    "@border-radius-base": "4px",
    "@line-height-base" : 1.6,
  },
  "html": { "template": "./public/index.ejs" },
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },

}


