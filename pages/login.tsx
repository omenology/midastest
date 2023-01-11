import { useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();

  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  const [isInputError, setIsInputError] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });

  const isEmailValid = (email: string): boolean => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
  };

  const isPasswordValid = (password: string): boolean => {
    return /^[A-Za-z]+$/.test(password);
  };

  const onSubmit = async () => {
    const email = inputEmailRef.current?.value || "";
    const password = inputPasswordRef.current?.value || "";

    if (!isEmailValid(email) || !isPasswordValid(password)) {
      setIsInputError({ email: !isEmailValid(email), password: !isPasswordValid(password) });
      return;
    }
    try {
      const res = await axios.post("https://reqres.in/api/login", {
        email,
        password,
      });

      Cookies.set("token", res.data.token);

      router.push("/");
    } catch (error) {
      console.log((error as any)?.response);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="border border-black rounded-md p-3">
        <h1 className="font-bold text-xl my-3">Login</h1>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-start">
            <p className="text-lg mb-1">Email</p>
            <input
              ref={inputEmailRef}
              type="text"
              placeholder="Email"
              onChange={() => {
                if (isInputError.email) setIsInputError({ ...isInputError, email: false });
              }}
              className="w-[300px] p-3 border border-gray-700 rounded-md"
            />
            <p className={`text-sm text-red-500 ${isInputError.email ? "" : "hidden"}`}>Email is not valid</p>
          </div>
          <div className="flex flex-col justify-start">
            <p className="text-lg mb-1">Password</p>
            <input
              ref={inputPasswordRef}
              type="password"
              placeholder="Password"
              onChange={() => {
                if (isInputError.password) setIsInputError({ ...isInputError, password: false });
              }}
              className="w-[300px] p-3 border border-gray-700 rounded-md"
            />
            <p className={`text-sm text-red-500 ${isInputError.password ? "" : "hidden"}`}>Password is not valid</p>
          </div>
          <button onClick={onSubmit} className="grow h-[50px] rounded-md bg-green-600 hover:bg-green-700">
            <p className="text-lg mb-1 text-white">Login</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
