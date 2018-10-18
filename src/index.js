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

  // This dispatches updates to the state
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
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

// Action Creator functions
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  }
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  }
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  }
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  }
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  }
}

// Pure function/Reducer that takes in state and an action to update the state
function todos(state = [], action) {
  switch(action.type) {
    case ADD_TODO :
      return state.concat([action.todo])
    case REMOVE_TODO :
      return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_TODO :
      return state.map((todo) => todo.id !== action.id ? todo :
      Object.assign({}, todo, { complete : !todo.complete }))
    default :
      return state
  }
}

// Goals Reducer to give our app's state something else to track
function goals(state = [], action) {
  switch(action.type) {
    case ADD_GOAL :
      return state.concat([action.goal])
    case REMOVE_GOAL :
      return state.filter((goal) => goal.id !== action.id)
    default :
      return state
  }
}

function app(state = {}, action) {
  // return a state object that has todos and goals properties
  // value of those properties is a reducer function that manages
  // slices of that state
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  }
}

// pass createStore the main app function/root reducer
const store = createStore(app)
// event listener
store.subscribe(() => {
  console.log('The new state is: ', store.getState())
})

store.dispatch(addTodoAction({
  id: 0,
  name: 'Learn Redux',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 1,
  name: 'Learn Redux some more!',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 1,
  name: 'Go roll some jiu-jitsu',
  complete: true,
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

store.dispatch(addGoalAction({
  id: 0,
  name: 'Learn Redux',
}))

store.dispatch(addGoalAction({
  id: 1,
  name: 'Learn Redux some more!',
}))

store.dispatch(removeGoalAction(0))

// const unsubscribe = store.subscribe(() => {
//   console.log('The store changed.')
// })
//
// unsubscribe()
