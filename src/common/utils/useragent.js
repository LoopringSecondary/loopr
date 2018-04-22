
export default {
  constructor(){
    this.useragent = navigator.userAgent
  }
  isMobile(){
     return !!this.useragent.match(/AppleWebKit.*Mobile.*/)
  }
  getLanguage(){
    return (navigator.browserLanguage || navigator.language).toLowerCase()
  }
  getOS(){
    let os = ''
    if (window.navigator.userAgent.indexOf("Windows NT 10.0")!= -1){
        os="Windows 10";
    }else if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1){
        os="Windows 8";
    }else if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1){
        os="Windows 7";
    }else if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1){
        os="Windows Vista";
    }else if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1){
        os="Windows XP";
    }else if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1){
        os="Windows 2000";
    }else if (window.navigator.userAgent.indexOf("Mac") != -1){
        os="Mac/iOS";
    }else if (window.navigator.userAgent.indexOf("X11") != -1){
        os="UNIX";
    }else if (window.navigator.userAgent.indexOf("Linux") != -1){
        os="Linux";
    }
    return os
  }


}
