import intl from 'react-intl-universal';
import locale from '../../modules/locales/localesData'
import moment from 'moment';

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
      moment.locale('en-gb');
      break;
    default:
      moment.locale('en-gb');
  }

  intl.init({
    currentLocale: value || 'en_US',
    locales,
  });

}
