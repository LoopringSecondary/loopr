import {getTransactionByhash} from "Loopring/ethereum/utils";
import validator from 'Loopring/ethereum/validator';
import filter from 'async/filter';

const addTx = (tx) => {
  const txs = localStorage.txs ? JSON.parse(localStorage.txs) : [];
  try {
    validator.validate({value: tx.hash, type: "ETH_DATA"});
    validator.validate({value: tx.owner, type: "ADDRESS"});
    txs.push(tx);
    localStorage.txs = JSON.stringify(txs);
  } catch (e) {
    throw new Error('InValid tx');
  }
};

const updateTx = async () => {
  let txs = localStorage.txs ? JSON.parse(localStorage.txs) : [];
  await filter(txs, async function (tx, callback) {
    const res = await getTransactionByhash(tx.hash);
    callback(null, !!res.result && !res.result.blockNumber) // callback 必须调动，使用callback 返回true or false
  }, function (err, results) {
    localStorage.txs = JSON.stringify(results);
  });
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
