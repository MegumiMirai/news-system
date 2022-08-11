const initState = {
  isLoading: false
}

export const LoadingReducer = (preState=initState, action) => {
  let {type, payload} =action

  switch (type){
    case 'change_loading':
      let newState = {...preState}
      newState.isLoading = payload
      return newState
    default:
      return preState
  }
  return preState
}