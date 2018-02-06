import {clearPrefix} from "./formatter";

export function makeBlob(content,mime) {
  content = typeof content === 'object' ? JSON.stringify(content) : content;
  if (content === null) {
    return '';
  }
  const blob = new Blob([content], {
    type: mime
  });
  return window.URL.createObjectURL(blob);
}


export function getFileName(address) {
  const ts = new Date();
 return  ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', clearPrefix(address), '.json'].join('')

}
