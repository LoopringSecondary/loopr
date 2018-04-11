
export default class UserAgent {
  constructor(){
    this.useragent = navigator.userAgent
  }
  isMobile(){
     return !!this.useragent.match(/AppleWebKit.*Mobile.*/)
  }
  getLanguage(){
    return (navigator.browserLanguage || navigator.language).toLowerCase()
  }
}
