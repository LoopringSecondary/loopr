import intl from 'react-intl-universal';
import locale from '../../modules/locales/localesData'


const locales = {
  "en-US": locale.en,
  "zh-CN": locale.zh
};

export  function setLocale(value){
  intl.init({
    currentLocale: value || 'en-US',
    locales,
  });

}
