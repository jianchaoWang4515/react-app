export function submitReducer(state, action) {
    switch(action.type) {
        case 'login':
            return {
                ...state,
                loading: true,
                error: '',
            }
        case 'success':
            return {
                ...state,
                loading: false,
            }
        case 'error':
            return {
                ...state,
                error: action.errorMsg || '',
                loading: false,
            }
        default: 
            return state;
    }
}