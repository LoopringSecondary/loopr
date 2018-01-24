export const languages = require('./languages.json');
let languagesArray = new Array();
for(var p in languages){
  languagesArray.push({language: p, value:languages[p]})
}
export {languagesArray}

export const timezones = require('./timezone.json');
let timezoneArray = new Array();
for(var p in timezones){
  timezoneArray.push({timezone: p, principal:timezones[p]})
}
export {timezoneArray}
