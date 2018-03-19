import intl from 'react-intl-universal';
import locale from '../../modules/locales/localesData'


const locales = {
  "en_US": locale.en_US,
  "zh_CN": locale.zh_CN
};

export  function setLocale(value){
  intl.init({
    currentLocale: value || 'en_US',
    locales,
  });

}
