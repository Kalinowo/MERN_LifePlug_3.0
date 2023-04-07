import React from "react";
import useLocalStorage from "use-local-storage";
//ProfileDisplayPic

export const GlobalContext = React.createContext();

export const GlobalProvider = (props) => {
  const [currentUser, setCurrentUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );

  //darkTheme
  const [theme, setTheme] = useLocalStorage("theme" ? "dark" : "light");

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  //blackCoverFunction
  const modalRef = React.useRef();
  const [pop, setPop] = React.useState(false);
  function turnPopOff(e) {
    if (modalRef.current === e.target) {
      setPop(false);
    }
  }
  //endOfBlackCoverFunction

  let [episodeCh, setEpisodeCh] = React.useState(null);

  return (
    <GlobalContext.Provider
      value={{
        modalRef,
        pop,
        setPop,
        turnPopOff,
        episodeCh,
        setEpisodeCh,
        theme,
        switchTheme,
        currentUser,
        setCurrentUser,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
