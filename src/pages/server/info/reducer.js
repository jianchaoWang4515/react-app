export function modalReducer(state, action) {
    switch (action.type) {
        case 'submit':
          return {
              ...state,
              loading: true
          }
        case 'success':
            return {
                visible: false,
                loading: false
            }
        case 'error':
                return {
                    ...state,
                    loading: false
                }
        case 'change':
                return {
                    ...state,
                    visible: !state.visible
                }
        default:
          return state;
      }
}