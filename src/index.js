function generateId() {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
}

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
  const { todos, goals } = store.getState()

  document.getElementById('todos').innerHTML = ''
  document.getElementById('goals').innerHTML = ''

  todos.forEach(addTodoToDOM)
  goals.forEach(addGoalToDOM)
})

// DOM CODE
function addTodo() {
  const input = document.getElementById('todo')
  const name = input.value
  input.value = ''

  store.dispatch(addTodoAction({
    name,
    complete: false,
    id: generateId(),
  }))
}

function addGoal() {
  const input = document.getElementById('goal')
  const name = input.value
  input.value = ''

  store.dispatch(addGoalAction({
    name,
    id: generateId(),
  }))
}

document.getElementById('todoBtn')
  .addEventListener('click', addTodo)

document.getElementById('goalBtn')
  .addEventListener('click', addGoal)

function createRemoveButton(onClick) {
  const removeBtn = document.createElement('button')
  removeBtn.innerHTML = 'X'
  removeBtn.addEventListener('click', onClick)
  return removeBtn
}

function addTodoToDOM(todo) {
  const node = document.createElement('li')
  const text = document.createTextNode(todo.name)
  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)
  node.style.textDecoration = todo.complete ? 'line-through' : 'none'
  node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id))
  })

  document.getElementById('todos')
    .appendChild(node)
}

function addGoalToDOM(goal) {
  const node = document.createElement('li')
  const text = document.createTextNode(goal.name)
  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  document.getElementById('goals')
    .appendChild(node)
}
