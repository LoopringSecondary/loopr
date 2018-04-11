var useragent = navigator.userAgent
var isMobile = useragent.match(/AppleWebKit.*Mobile.*/)
if(isMobile){
  location.href = '/mobile/index.html'
}
