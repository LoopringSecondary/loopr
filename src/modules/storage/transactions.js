import {getTransactionByhash} from "Loopring/ethereum/utils";


const addTx = (hash) => {
  const txs = localStorage.txs ? JSON.parse(localStorage.txs) : [];
  txs.push({hash});
  localStorage.txs = JSON.stringify(txs);
};

const updateTx = async () => {
  const txs = localStorage.txs ? JSON.parse(localStorage.txs) : [];
  if(txs.length === 0 ){
   await txs.filter( async ({hash}) => {
      const result  = await getTransactionByhash(hash);
      return  !result.blockNumber
    });
    localStorage.txs = JSON.stringify(txs);
  }
};

const getTxs = () => {
  return localStorage.txs ? JSON.parse(localStorage.txs) : [];
};

export default {
  addTx,
  updateTx,
  getTxs
}
