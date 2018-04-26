import Useragent from 'useragent.js'

export default class UserAgent {
  constructor() {
    this.ua = Useragent.analyze(window.navigator.userAgent)
  }

  isMobile() {
    return !!this.useragent.match(/AppleWebKit.*Mobile.*/)
  }

  getLanguage() {
    const language = window.navigator.browserLanguage || window.navigator.language
    if (language.startsWith('zh')) {
      return 'zh-CN'
    } else if (language.startsWith('en')) {
      return 'en-US'
    }

    return 'en-US'
  }

  getOS() {
    return this.ua.os
  }

  getDevice() {
    return this.ua.device
  }

  getBrowser() {
    return this.ua.browser
  }

  getOS() {
    return this.ua.platform
  }
}
