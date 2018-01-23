import React, { Component } from 'react';
import { connect } from 'dva';
import {IntlProvider,addLocaleData,injectIntl} from 'react-intl';
import en from 'react-intl/locale-data/en';  
import zh from 'react-intl/locale-data/zh';  
addLocaleData([...en, ...zh]);  

const Locales = ({ history,locales={},children})=>{
		const appProps = {
			locale:locales.locale,
			messages:locales.messages,
		}
	  return (
	  	<IntlProvider {...appProps}>
	  		{children}
	  	</IntlProvider>
	  )
}
export default connect(({locales})=>({locales}))(Locales)

// @connect(({locales})=>({locales}))
// export default class Root extends Component {
// 	render(){
// 			const {locales={}} = this.props
// 			const appProps = {
// 				locale:locales.locale,
// 				messages:locales.messages,
// 			}
// 		  return (
// 		  	<IntlProvider {...appProps}>
// 		  		{this.props.children}
// 		  	</IntlProvider>
// 		  )
// 	}
// }



