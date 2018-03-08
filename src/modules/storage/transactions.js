import {getTransactionByhash} from "Loopring/ethereum/utils";
import validator from 'Loopring/ethereum/validator';

const addTx = (tx) => {
  const txs = localStorage.txs ? JSON.parse(localStorage.txs) : [];
  try {
    validator.validate({value: tx.hash, type: "ETH_DATA"});
    validator.validate({value: tx.owner,type:"ADDRESS"});
    txs.push(tx);
    localStorage.txs = JSON.stringify(txs);
  } catch (e) {
    throw new Error('InValid tx');
  }
};

const updateTx = async () => {
  const txs = localStorage.txs ? JSON.parse(localStorage.txs) : [];
  if (txs.length !== 0) {
    await txs.filter(async ({hash}) => {
      const result = await getTransactionByhash(hash);
      return !!result.result && !result.blockNumber
    });
  }
  localStorage.txs = JSON.stringify(txs);
};

const getTxs = (owner) => {
  const txs = localStorage.txs ? JSON.parse(localStorage.txs) : [];
  if (owner) {
    return txs.filter((tx) => {
      return !!tx.owner && tx.owner === owner
    })
  } else {
    return txs
  }
};

export default {
  addTx,
  updateTx,
  getTxs
}
