import React, { Component } from 'react';
import { connect } from 'dva';
import { LocaleProvider } from 'antd';
import zh from 'antd/lib/locale-provider/zh_CN';
import en from 'antd/lib/locale-provider/en_US';
import {IntlProvider,addLocaleData,injectIntl} from 'react-intl';
import enApp from 'react-intl/locale-data/en';
import zhApp from 'react-intl/locale-data/zh';
addLocaleData([...enApp, ...zhApp]);
const antdLocales = {zh,en}

const Locales = ({ history,locales={},children})=>{
		const appProps = {
			locale:locales.locale,
			messages:locales.messages,
		}
		const antdProps = {
			locale:antdLocales[locales.locale],
		}

	  return (
	  	<IntlProvider {...appProps}>
	  		<LocaleProvider {...antdProps}>
	  			{children}
	  		</LocaleProvider>
	  	</IntlProvider>
	  )
}
export default connect(({locales})=>({locales}))(Locales)



