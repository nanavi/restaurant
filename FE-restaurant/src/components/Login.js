import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../UserContext";

const print_status = (status) => {
  if (status !== null) {
    return <p>{status}</p>;
  }
  return <h1></h1>;
};

export default function Login() {
  const { register, handleSubmit, errors } = useForm();
  const [status, setStatus] = useState(null);
  const { user, setUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      let res = await fetch("http://localhost:5555/login", {
        method: "POST",
        body: data,
      });
      let res_login = await res.json();
      if (res_login.success) {
        setStatus("sucess");
        setUser(res_login.user);
      }
    } catch (err) {
      console.log(err);
      setStatus("failed");
    }
  };
  const onSubmit2 = (data) => {
    console.log(data);
    try {
      setStatus("sucess");
      setUser(data);
    } catch (err) {
      console.log(err);
      setStatus("failed");
    }
  };

  useEffect(() => {
    localStorage.setItem("session", JSON.stringify(user));
  }, [user]);

  return (
    <div>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      {print_status(status)}
      {user ? (
        <button
          onClick={() => {
            setUser(null);
            setStatus(null);
            // localStorage.removeItem("session");
          }}
        >
          logout
        </button>
      ) : (
        <div>
          <div>
            <form onSubmit={handleSubmit(onSubmit2)}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                ref={register({ required: "email required" })}
              />
              <br />
              <input
                type="password"
                placeholder="Password"
                name="password"
                ref={register({ required: "password required" })}
              />
              <br />
              {errors.password && <p>{errors.password.message}</p>}
              <input type="submit" value="Log in" />
            </form>
          </div>
        </div>
      )}
    </div>
    //   <form>

    //   </form>
  );
}
