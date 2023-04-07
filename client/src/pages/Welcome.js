import React from "react";
import Modal from "../components/authenticationPage/Modal";
import { GlobalContext } from "../context/GlobalState";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const { pop, setPop, currentUser } = React.useContext(GlobalContext);
  let navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser) {
      navigate("/LifePlug", { replace: true });
    }
  }, []);

  return (
    <>
      <Modal />
      <div className="welcomeOuter">
        <div className="backgroundImageOuter">
          <div className="container">
            <img src="material/ReZeroBackground.png" />
            <div className="cardOuter">
              <div className="cardContainer">
                <div className="cardTextWrapper">
                  <div className="text">LifePlug</div>
                </div>
                <div className="loginChargerContainer" data-pop={pop}>
                  <button
                    className="loginChargerText"
                    onClick={() => setPop(true)}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
