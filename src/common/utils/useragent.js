import Useragent from 'useragent.js'
export default class UserAgent {
  constructor(){
    this.ua = Useragent.analyze(window.navigator.userAgent)
  }
  isMobile(){
     return !!this.useragent.match(/AppleWebKit.*Mobile.*/)
  }
  getLanguage(){
    return (window.navigator.browserLanguage || window.navigator.language).toLowerCase()
  }
  getOS(){
    return this.ua.os
  }
  getDevice(){
    return this.ua.device
  }
  getBrowser(){
    return this.ua.browser
  }
  getOS(){
    return this.ua.platform
  }
}
