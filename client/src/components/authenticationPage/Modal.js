import React from "react";

import Login from "./Login";
import Register from "./Register";
import { GlobalContext } from "../../context/GlobalState";

export default function Modal() {
  const [formType, setFormType] = React.useState("登入");
  const [successAlert, setSuccessAlert] = React.useState(null);

  const { modalRef, pop, turnPopOff } = React.useContext(GlobalContext);

  React.useEffect(() => {
    function successCountDown() {
      if (successAlert && successAlert > 0) {
        setSuccessAlert((prev) => prev - 1);
      }
    }
    const countDown = setTimeout(successCountDown, 1000);

    return function cleanup() {
      clearTimeout(countDown);
    };
  }, [successAlert]);

  React.useEffect(() => {
    if (successAlert === 0) {
      setFormType("登入");
      setSuccessAlert(null);
    }
  }, [successAlert]);

  function toggleFormType() {
    if (formType === "登入") {
      setFormType("註冊");
    } else {
      setFormType("登入");
    }
  }

  return (
    <>
      {pop === true && (
        <div
          ref={modalRef}
          className="authenticateModal"
          onClick={(e) => turnPopOff(e)}
        >
          {successAlert && (
            <div className="successAlertModal">
              <div className="sucessAlertOuter">
                註冊成功！！({successAlert})
              </div>
            </div>
          )}

          <div className="formOuter">
            <div className="formContainer">
              <div className="formSelect">
                <button
                  style={formType === "登入" ? { background: "white" } : {}}
                  onClick={() => toggleFormType()}
                >
                  登入
                </button>
                <button
                  style={formType === "註冊" ? { background: "white" } : {}}
                  onClick={() => toggleFormType()}
                >
                  註冊
                </button>
              </div>
              {formType === "登入" && <Login />}
              {formType === "註冊" && (
                <Register setSuccessAlert={setSuccessAlert} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
