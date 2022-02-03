import React, { useReducer, createContext, useContext, useRef } from 'react';

const initialTodos = [
  {
    id: 1,
    text: '프로젝트 생성하기',
    done: true
  },
  {
    id: 2,
    text: '컴포넌트 스타일링하기',
    done: true
  },
  {
    id: 3,
    text: 'Context 만들기',
    done: false
  },
  {
    id: 4,
    text: '기능 구현하기',
    done: false
  }
];

function todoReducer(state, action) {
  switch (action.type) {
    case 'CREATE':
      return state.concat(action.todo);
    case 'TOGGLE':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// state와 dispatch를 Context 통하여 다른 컴포넌트에서 바로 사용 할 수 있게 해주기
// 두개의 Context 를 만들어서 state와 dispatch 따로 따로 넣어주기
const TodoStateContext = createContext();
const TodoDispatchContext = createContext();

// nextId값을 위한 Context 만들기
// nextId가 의미하는 값은 새로운 항목을 추가 할 때 사용 할 고유 ID
// 이 값은, useRef를 사용하여 관리할 것임
const TodoNextIdContext = createContext();

// useReducer를 사용하여 상태를 관리하는 TodoProvider 컴포넌트
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

// 컴포넌트에서 useContext를 직접 사용하는 대신
// useContext를 사용하는 커스텀 Hook을 만들어서 내보내기

// useTodoState, useTodoDispatch, useTodoNextId Hook 을 사용하려면,
// 해당 컴포넌트가 TodoProvider 컴포넌트 내부에 렌더링되어 있어야 함 (예: App 컴포넌트에서 모든 내용을 TodoProvider 로 감싸기).
// 만약 TodoProvider로 감싸져있지 않다면 에러를 발생시키도록 커스텀 Hook을 수정
export function useTodoState() {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}

export function useTodoNextId() {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error('Cannot find TodoProvider');
  }
  return context;
}