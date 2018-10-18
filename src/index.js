// LIBRARY CODE
function createStore(reducer) {
  // The store should have four parts
  // 1. The state or "state tree"
  // 2. Get the state.
  // 3. Listen to changes on the state.
  // 4. Update the state

  // This holds the state of the entire app
  let state
  let listeners = []

  // This gets the state
  const getState = () => state

  // This listens for changes to state
  const subscribe = (listner) => {
    listeners.push(listner)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  return {
    // Whenever createStore is envoked, we want to return an object.
    // the getState object will then return us the existing state variable.
    getState,
    subscribe,
    dispatch,
  }
}

// APP CODE
// Pure function/Reducer that takes in state and an action to update the state
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO' :
      return state.concat([action.todo])
    case 'REMOVE_TODO' :
      return state.filter((todo) => todo.id !== action.id)
    case 'TOGGLE_TODO' :
      return state.map((todo) => todo.id !== action.id ? todo :
      Object.assign({}, todo, { complete : !todo.complete }))
    default :
      return state
  }
}


const store = createStore(todos)
// event listener
store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 0,
    name: 'Learn Redux',
    complete: false,
  }
})

store.dispatch({
  type: 'ADD_TODO',
  todo: {
    id: 1,
    name: 'something else',
    complete: true,
  }
})
// const unsubscribe = store.subscribe(() => {
//   console.log('The store changed.')
// })
//
// unsubscribe()
