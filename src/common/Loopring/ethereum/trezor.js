export function getAddress(path) {
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

export function trezorSign({path, tx}) {
  path = path || "m/44'/60'/0'/0/0";
  return new Promise((resolve) => {
    window.TrezorConnect.ethereumSignMessage(path, tx, function (result) {
      if (result.success) {
        resolve(result.signature)
      } else {
        console.error('Error:', result.error); // error message
      }
    });
  })
}



