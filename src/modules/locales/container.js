import React, { Component } from 'react';
import { connect } from 'dva';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
const antdLocales = {zh_CN,en_US}

const Locales = ({ history,locales={},children})=>{
  const antLocale  = locales.locale.replace('-',"_");
    const antdProps = {
      locale:antdLocales[antLocale],
    };
    return (
      <LocaleProvider {...antdProps}>
        {children}
      </LocaleProvider>
    )
}
export default connect(({locales})=>({locales}))(Locales)



