import { useState } from "react";
import axios from "axios";

const LogIn = ({ setUser }) => {
  const [createAccount, setCreateAccount] = useState("");
  const [account, setAccount] = useState("");

  const onSubmitCreateUser = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/user`,
        {
          account: createAccount,
        }
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(error);

      alert("계정 생성을 실패하였습니다."); // 추가하여 계정이 안되었을때 팝업창이 뜨도록 만듬. catch에 넣어서 구동되도록 만듬.
    }
  };

  const onSubmitLogIn = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/${account}` // 고정값 대신 ${account}로 작성된 이유는 유저정보가 없으면 확인이 가능하도록 하기 위해서.
      );

      setUser(response.data.user);
    } catch (error) {
      console.error(error);

      alert("로그인을 실패하였습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <form className="flex mt-2 my-16" onSubmit={onSubmitCreateUser}>
        <input
          className="grow border-2 border-green-200 rounded-lg focus:outline-green-400 px-2 py-1 text-lg"
          type="text"
          value={createAccount}
          onChange={(e) => setCreateAccount(e.target.value)}
        />
        <input
          className="ml-4 px-2 py-1 bg-green-400 rounded-lg text-gray-50 w-24"
          type="submit"
          value="계정 생성"
        />
      </form>
      <form className="flex mt-2 my-16" onSubmit={onSubmitLogIn}>
        <input
          className="grow border-2 border-green-200 rounded-lg focus:outline-green-400 px-2 py-1 text-lg"
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
        />
        <input
          className="ml-4 px-2 py-1 bg-green-400 rounded-lg text-gray-50 w-24"
          type="submit"
          value="로그인"
        />
      </form>
    </div>
  );
};

export default LogIn;
