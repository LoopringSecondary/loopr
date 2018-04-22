
export default {
  getDevice(){

  }
  getLanguage(){
    return (window.navigator.browserLanguage || window.navigator.language).toLowerCase()
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
  getBrowser(){
    let browser = {};
    let userAgent = navigator.userAgent.toLowerCase();
    let s;
    (s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
    let version = "";
    if (browser.ie) {
      version = 'IE ' + browser.ie;
    }
    else {
      if (browser.firefox) {
        version = 'firefox ' + browser.firefox;
      }
      else {
        if (browser.chrome) {
          version = 'chrome ' + browser.chrome;
        }
        else {
          if (browser.opera) {
            version = 'opera ' + browser.opera;
          }
          else {
            if (browser.safari) {
              version = 'safari ' + browser.safari;
            }
            else {
              version = '其他浏览器';
            }
          }
        }
      }
    }
    return version;
  }



}
