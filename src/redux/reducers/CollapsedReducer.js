const initState = {
  isCollapsed: false
}

export const CollapsedReducer = (preState=initState, action) => {
  let {type} =action

  switch (type){
    case 'change_collapsed':
      let newState = {...preState}
      newState.isCollapsed = !newState.isCollapsed
      return newState
    default:
      return preState
  }
  return preState
}