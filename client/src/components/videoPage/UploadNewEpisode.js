import React from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";
import AnimeService from "../../services/anime.Service";
import CustomButton from "../../UI/Button";

export default function UploadNewEpisode(props) {
  const { modalRef, setPop, turnPopOff } = React.useContext(GlobalContext);
  let [link, setLink] = React.useState("");

  let navigate = useNavigate();

  let inputCSS = {
    top: "-15px",
    color: "rgb(238, 248, 255)",
    textShadow: "0 0 7px rgb(183, 226, 255), 0 0 21px rgb(183, 226, 255)",
    fontSize: "12px",
  };

  const postEpisode = () => {
    if (link) {
      let title = props.anime[0].title;
      AnimeService.postEpisode(link, title).then((data) => {
        setPop(false);
        navigate(0);
      });
    }
  };

  return (
    <React.Fragment>
      <div className="videoModal" ref={modalRef} onClick={(e) => turnPopOff(e)}>
        <div className="postOuter" style={{ top: "40%" }}>
          <form onClick={(e) => e.preventDefault()}>
            <div className="formTitle">管理員的超能力(新增集數)</div>
            <div className="formGroup2">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
              ></input>
              <label style={link !== "" ? inputCSS : {}}>網址</label>
            </div>
            <CustomButton children="confirm" onClick={postEpisode} />
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}
