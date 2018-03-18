import localesData from './localesData'
let language = window.STORAGE.settings.get().preference.language
export default {
  namespace: 'locales',
  state: {
    locale: language || 'en',
    messages:language ? localesData[language] : localesData['en']
  },
  reducers: {
    localeChange(state, { payload }) {
      return {
        locale: payload.locale,
        messages:localesData[payload.locale]
      };
    },
  },
};
