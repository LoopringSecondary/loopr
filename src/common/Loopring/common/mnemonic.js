import {mnemonicToSeed, validateMnemonic} from 'bip39';
import {fromMasterSeed} from 'hdkey';


export function mnemonictoPrivatekey(phrase, pass, path) {
  phrase = phrase.trim();
  if (!validateMnemonic(phrase)) {
    throw new Error('Invalid mnemonic');
  }
  const seed = mnemonicToSeed(phrase, pass);
  const derived = fromMasterSeed(seed).derive(path);
  return derived.privateKey;
}


export function isValidateMnemonic(phrase) {
  return validateMnemonic(phrase)
}
