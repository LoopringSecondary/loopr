import {ecsign} from 'ethereumjs-util'


export default class Account {

  constructor(input) {
    this.unlockType = input.unlockType;
    this.address = input.address;
    this.password =input.password;
  }

  setUnlockType(unlockType) {
    this.unlockType = unlockType
  }

  setAddress(address) {
    this.address = address
  }

  getPassword(){
    return this.password
  }

  getAddress() {
    return this.address
  }
  getAddresses(){}

  isUnlocked() {
    return this.unlockType !== ''
  }

  getUnlockedType() {
    return this.unlockType
  }

  signWithPrivateKey(hash, privateKey) {

    return ecsign(hash,privateKey)
  }

 async signOrder(){

  }
}
