export default {
  namespace: 'modals',
  state: {},
  reducers: {
    modalChange(state, { payload }) {
      const { id:modalId } = payload
      const thisModal = state[modalId]
      delete payload.id
      return {
       ...state,
       [modalId]:{
        ...thisModal,
        ...payload,
       }
      }
    },
  },
};
