import localesData from './localesData'

export default {
  namespace: 'locales',
  state: {
    locale: 'en',
    messages:localesData['en']
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
