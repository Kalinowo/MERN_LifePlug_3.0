import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import CustomButton from "../../UI/Button";
import authenticateService from "../../services/authenticate.Service";

export default function Login() {
  const [message, setMessage] = React.useState("");
  const { setPop } = React.useContext(GlobalContext);

  const emailRef = useRef();
  const passwordRef = useRef();

  let navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    let email = emailRef.current.value;
    let password = passwordRef.current.value;
    authenticateService
      .memberLogin(email, password)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("user", JSON.stringify(res.data));
          setMessage("");
          setPop(false);
          navigate("/LifePlug", { replace: true });
        } else {
          setMessage("帳號或密碼錯誤");
        }
      })
      .catch((err) => {
        switch (err.response.data) {
          case `"username" is not allowed to be empty`:
            setMessage("帳號不得為空");
            break;
          case `"password" is not allowed to be empty`:
            setMessage("密碼不得為空");
            break;
          case `"password" length must be at least 6 characters long`:
            setMessage("密碼必須大於6個字元");
            break;
          default:
            console.log(err.response.data);
        }
      });
  }

  return (
    <>
      <form className="formContent" onSubmit={onSubmit}>
        <div className="formTitle">會員登入</div>
        <input ref={emailRef} type="email" placeholder="E-mail"></input>
        <input ref={passwordRef} type="password" placeholder="Password"></input>
        {message && <div className="text-red">{message}</div>}
        <div className="submitBtnContainer">
          <CustomButton fontSize="17px" width="60%" onClick={onSubmit}>
            Login
          </CustomButton>
          <CustomButton
            fontSize="17px"
            width="40%"
            onClick={() => setPop(false)}
          >
            Cancel
          </CustomButton>
        </div>
      </form>
    </>
  );
}
