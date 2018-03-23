import intl from 'react-intl-universal';
import locale from '../../modules/locales/localesData'
import moment from 'moment';
import IntlPolyfill from "intl";

const locales = {
  "en_US": locale.en_US,
  "zh_CN": locale.zh_CN
};

export function setLocale(value) {

  switch (value) {
    case "zh_CN" :
      moment.locale('zh-cn');
      break;
    case "en_US":
      moment.locale('en');
      break;
    default:
      moment.locale('en');
  }

  global.Intl = IntlPolyfill;
  require('intl/locale-data/jsonp/en.js');
  require('intl/locale-data/jsonp/zh.js');
  require('intl/locale-data/jsonp/fr.js');
  require('intl/locale-data/jsonp/ja.js');

  intl.init({
    currentLocale: value || 'en_US',
    locales,
  });

}
