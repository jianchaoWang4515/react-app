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

export function tableReducer(state, action) {
    switch (action.type) {
        case 'fetch':
          return {
              ...state,
              loading: true
          }
        case 'success':
            return {
                data: action.data,
                loading: false
            }
        case 'error':
                return {
                    ...state,
                    loading: false
                }
        default:
          return state;
      }
}