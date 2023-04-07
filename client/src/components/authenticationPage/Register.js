import React from "react";
import CustomButton from "../../UI/Button";
import authenticateService from "../../services/authenticate.Service";

export default function Register(props) {
  const [message, setMessage] = React.useState("");

  let { successAlert, setSuccessAlert } = props;

  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const verifyPasswordRef = React.useRef();

  function onSubmit(e) {
    e.preventDefault();
    let email = emailRef.current.value;
    let password = passwordRef.current.value;
    let verifyPassword = verifyPasswordRef.current.value;

    authenticateService
      .memberRegister(email, password, verifyPassword)
      .then((res) => {
        switch (res.data) {
          case `"username" is not allowed to be empty`:
            setMessage("Email不得為空");
            break;
          case `"username" must be a valid email`:
            setMessage("請填寫正確的email");
            break;
          case `"username" length must be less than or equal to 50 characters long`:
            setMessage("Email不得多於50字元");
            break;
          case `"password" is not allowed to be empty`:
            setMessage("密碼不得為空");
            break;
          case `"password" length must be at least 6 characters long`:
            setMessage("密碼必須大於6個字元");
            break;
          case `"verifyPassword" must be [ref:password]`:
            setMessage("二次密碼不相符");
            break;
          case "emailAlert":
            setMessage("email已註冊");
            break;
          case "registerSuccess!":
            setMessage("");
            setSuccessAlert(5);
            break;
          default:
            console.log(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <form className="formContent" onSubmit={onSubmit}>
        <div className="formTitle">會員註冊</div>
        <input ref={emailRef} type="email" placeholder="E-mail"></input>
        <input ref={passwordRef} type="password" placeholder="Password"></input>
        <input
          ref={verifyPasswordRef}
          type="password"
          placeholder="Repeat-Password"
        ></input>
        {message && <div className="alertMessage">{message}</div>}
        <div className="submitBtnContainer">
          <CustomButton fontSize="17px" width="60%" onClick={onSubmit}>
            Register
          </CustomButton>
          <CustomButton fontSize="17px" width="40%">
            Cancel
          </CustomButton>
        </div>
      </form>
    </>
  );
}
