import React from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";

export default function Redirect() {
  const { currentUser, setCurrentUser } = React.useContext(GlobalContext);
  let navigate = useNavigate();
  React.useEffect(() => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  }, []);
  return <></>;
}
