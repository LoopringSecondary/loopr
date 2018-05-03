export async function getAddress(path) {
  path = path || "m/44'/60'/0'/0/0";
  return new Promise((resolve) => {
    window.TrezorConnect.ethereumGetAddress(path, function (result) {
      if (result.success) {
        resolve(result.address)
      } else {
        throw new Error(result.error);
      }
    });
  })
}

export async function trezorSign({path, hash}) {
  path = path || "m/44'/60'/0'/0/0";
  return new Promise((resolve) => {
    window.TrezorConnect.ethereumSignMessage(path, hash, function (result) {
      if (result.success) {
        resolve(result.signature)
      } else {
       throw new Error(result.error.message)
      }
    });
  })
}



