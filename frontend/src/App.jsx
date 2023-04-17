import { useEffect, useState } from "react";
import LogIn from "./components/LogIn";
import TodoCard from "./components/TodoCard";
import axios from "axios";
import CreateTodo from "./components/CreateTodo";

function App() {
  const [user, setUser] = useState();
  const [todos, setTodos] = useState();
  const [skip, setSkip] = useState(0);

  const getTodos = async () => {
    try {
      if (!user) return;

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/${user.id}?skip=${skip}`
      );

      setTodos(response.data.todos);
      setSkip(skip + 3);
    } catch (error) {
      console.error(error);

      alert("투두리스트를 불러오지 못했습니다.");
    }
  };

  const onClickLogOut = () => {
    setUser(undefined); // 빈칸이나 undefined 는 같지만 ""(문자열)은 다르다.
  };

  const onClickReload = async () => {
    try {
      if (!user) return;

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/todo/${user.id}?skip=${skip}`
      );

      setTodos([...todos, ...response.data.todos]); // ...(스프레드)는 배열을 펼칠때 사용.
      setSkip(skip + 3);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTodos(); // 비동기 함수는 안에 로직을 적는것이 아닌 바깥에 로직을 작성해야 해서 위에 작성.

    console.log(user);
  }, [user]);

  useEffect(() => {
    console.log(todos);
  }, [todos]);

  if (!user) {
    return <LogIn setUser={setUser} />;
  } // if문도 return을 쓸수있다. 이렇게 코드를 작성하면 로그인을 해야 아래 코드로 넘어갈 수 있는 길을 만드는것과 같다.

  return (
    <div className="min-h-screen flex flex-col justify-start items-center pt-16">
      <h1 className="text-4xl font-bold flex items-center">
        {user.account}님 환영합니다~ 😎
        <button
          className="ml-4 px-2 py-1 bg-pink-200 hover:bg-pink-400 rounded-lg text-gray-50 text-base"
          onClick={onClickLogOut}
        >
          로그아웃
        </button>
      </h1>
      <div>
        <div className="mt-8 text-sm font-semibold">
          If I only had an hour to chop down a tree, I would spend the first 45
          minutes sharpening my axe, Abrabam Lincoln
        </div>
        <div className="text-xs">
          나무 베는데 한 시간이 주어진다면, 도끼를 가는데 45분을 쓰겠다,
          에비브러햄 링컨
        </div>
        <CreateTodo userId={user.id} todos={todos} setTodos={setTodos} />
      </div>
      <div className="mt-16">
        <button
          className="ml-4 px-4 py-2 w-24 h-24 bg-pink-200 hover:bg-pink-400 rounded-full text-gray-50 text-2xl"
          onClick={onClickReload}
        >
          갱 신
        </button>
      </div>

      <div className="mt-16 flex flex-col w-1/2">
        {todos &&
          todos.map((v, i) => {
            return (
              <TodoCard
                key={i}
                todo={v.todo}
                isDone={v.isDone}
                id={v.id}
                userId={user.id}
                todos={todos}
                setTodos={setTodos}
              />
            );
          })}
      </div>
    </div>
  );
}

export default App;
