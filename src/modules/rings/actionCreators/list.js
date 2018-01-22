import namespace from '../namespace'
const {MODULES} = namespace
const modelCreator = window.REDUX.modelCreator.List;
let { actionCreators }= modelCreator(MODULES);
actionCreators = {
  ...actionCreators,
}
export default actionCreators;