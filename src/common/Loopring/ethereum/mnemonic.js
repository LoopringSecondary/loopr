import {mnemonicToSeed, validateMnemonic} from 'bip39';
import {fromMasterSeed} from 'hdkey';

/**
 * Decrypt mnemonic into ethereum private key
 * @param mnemonic string
 * @param password string
 * @param path string
 */
export function mnemonictoPrivatekey(mnemonic, password, path) {
  mnemonic = mnemonic.trim();
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }
  const seed = mnemonicToSeed(mnemonic, password);
  const derived = fromMasterSeed(seed).derive(path);
  return derived.privateKey;
}

/**
 * Valid mnemonic
 * @param phrase string
 * @returns {bool}
 */
export function isValidateMnemonic(phrase) {
  return validateMnemonic(phrase)
}
