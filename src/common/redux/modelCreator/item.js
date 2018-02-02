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
  let actionTypes = easyRedux.getActionTypes(module,keys);
  let actionCreators = easyRedux.getActionCreators(module,keys);
  return {
    actionTypes,
    actionCreators,
  }
}

export default create;











