'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  isNew?: boolean; // 새로 추가된 항목 표시
  isDeleting?: boolean; // 삭제 중인 항목 표시
}

type FilterType = 'all' | 'active' | 'completed';

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const { theme } = useTheme();

  // localStorage에서 할 일 목록 불러오기
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // 할 일 목록이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    // isNew, isDeleting 플래그 제거하고 JSON으로 저장
    const persistTodos = todos.map(({ isNew, isDeleting, ...rest }) => rest);
    localStorage.setItem('todos', JSON.stringify(persistTodos));
  }, [todos]);

  // 새 할 일 추가
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: TodoItem = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        isNew: true, // 새 항목 표시
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
      
      // 애니메이션 완료 후 isNew 플래그 제거
      setTimeout(() => {
        setTodos(prevTodos => 
          prevTodos.map(todo => 
            todo.id === newTodo.id ? { ...todo, isNew: false } : todo
          )
        );
      }, 500);
    }
  };

  // 할 일 삭제
  const deleteTodo = (id: number) => {
    // 삭제 애니메이션 적용
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, isDeleting: true } : todo
      )
    );
    
    // 애니메이션 후 실제 삭제
    setTimeout(() => {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    }, 300);
  };

  // 할 일 완료 상태 토글
  const toggleComplete = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // 할 일 편집 모드 시작
  const startEditing = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  // 할 일 편집 완료
  const finishEditing = () => {
    if (editingId !== null) {
      setTodos(
        todos.map(todo =>
          todo.id === editingId ? { ...todo, text: editText.trim() } : todo
        )
      );
      setEditingId(null);
      setEditText('');
    }
  };

  // 편집 중 엔터 키 처리
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  // 필터링된 할 일 목록
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // 감성적인 피드백 메시지
  const getEmptyMessage = () => {
    if (filter === 'all') {
      return '📝 아직 할 일이 없어요. 새로운 계획을 세워볼까요?';
    } else if (filter === 'active') {
      return '🎉 모든 일을 완료했어요! 멋진 성과입니다!';
    } else {
      return '✨ 아직 완료된 항목이 없어요. 첫 번째 성취를 이루어보세요!';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 transition-colors duration-300">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold font-sans text-gray-900 flex items-center gap-2">✔️ 할 일 목록</h2>
      </div>
      {/* 입력 폼 */}
      <div className="flex rounded-full overflow-hidden shadow-sm mb-4 bg-slate-50">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-gray-800 placeholder-gray-400 text-base font-sans focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="할 일을 입력하세요"
        />
        <button
          onClick={addTodo}
          className="rounded-full px-5 py-2 text-base font-semibold bg-blue-600 text-white hover:brightness-95 focus:ring-2 focus:ring-blue-400 transition-all"
        >
          추가
        </button>
      </div>
      {/* 필터 버튼 */}
      <div className="flex space-x-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-5 py-2 text-base font-semibold transition-all focus:ring-2 focus:ring-blue-400 hover:brightness-95 ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`rounded-full px-5 py-2 text-base font-semibold transition-all focus:ring-2 focus:ring-blue-400 hover:brightness-95 ${
            filter === 'active' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
          }`}
        >
          미완료
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`rounded-full px-5 py-2 text-base font-semibold transition-all focus:ring-2 focus:ring-blue-400 hover:brightness-95 ${
            filter === 'completed' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
          }`}
        >
          완료
        </button>
      </div>
      {/* 할 일 목록 */}
      <ul className="space-y-4">
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            className={`bg-slate-50 shadow-md rounded-xl p-4 flex items-center group transition-all duration-300
              ${todo.isNew ? 'animate-fadeIn' : ''}
              ${todo.isDeleting ? 'animate-fadeOut opacity-0 scale-95' : ''}
              ${todo.completed ? 'bg-opacity-70' : ''}`}
            onDoubleClick={() => startEditing(todo)}
          >
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={finishEditing}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base font-sans focus:ring-2 focus:ring-blue-400 focus:outline-none"
                autoFocus
              />
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 flex-grow">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    id={`todo-${todo.id}`}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`cursor-pointer transition-all duration-300 text-lg font-sans
                      ${todo.completed ? 'line-through opacity-70' : 'opacity-100'}
                      text-gray-800`}
                  >
                    {todo.completed ? '✅ ' : '☐ '}{todo.text}
                  </label>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="rounded-full px-5 py-2 text-base font-semibold text-red-500 opacity-0 group-hover:opacity-100 hover:brightness-95 focus:ring-2 focus:ring-blue-400 transition-all hover:text-red-700 hover:bg-red-100"
                >
                  삭제
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {/* 할 일이 없는 경우 메시지 */}
      {filteredTodos.length === 0 && (
        <div className="text-center py-10 px-6 rounded-xl shadow-md bg-slate-50 text-gray-500 mt-6">
          <p className="text-xl font-medium">{getEmptyMessage()}</p>
        </div>
      )}
    </div>
  );
} 