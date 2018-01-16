import easyRedux from '../utils';

function create(module){
  let keys = [
        "fetch",
        // "fetchStart",
        // "fetchSuccess",
        // "fetchError",

        "update",
        // "updateStart",
        // "updateSuccess",
        // "updateError",

        "create",
        // "createStart",
        // "createSuccess",
        // "createError",

        "delete",
        // "deleteStart",
        // "deleteSuccess",
        // "deleteError",
  ];
  let actionTypes = easyRedux.actionTypes(module,keys);
  let actionCreators = easyRedux.actionCreators(module,keys);
  return {
    actionTypes,
    actionCreators,
  }
}

export default create;











