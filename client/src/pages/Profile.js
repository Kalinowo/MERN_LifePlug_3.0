import React, { Suspense } from "react";
import { GlobalContext } from "../context/GlobalState";
import SelectDP from "../components/profilePage/SelectDP";
import ProfileService from "../services/profile.service";
import { useNavigate, useLoaderData, defer, Await } from "react-router-dom";

import CustomButton from "../UI/Button";

export async function profileDataLoader() {
  async function getProfile() {
    let userInfo = null;
    await ProfileService.getUser().then((res) => {
      userInfo = res.data;
    });
    return userInfo;
  }

  return defer({ profileData: getProfile() });
}

export default function Profile() {
  const { profileData } = useLoaderData();
  const { currentUser, setCurrentUser, pop, setPop, theme } =
    React.useContext(GlobalContext);
  const [updateNameBtn, setUpdateNameBtn] = React.useState(false);
  const [updateName, setUpdateName] = React.useState("");
  const [editedName, setEditedName] = React.useState(null);
  const [editedDp, setEditedDp] = React.useState(null);
  let navigate = useNavigate();

  function updateNameTrigger() {
    setUpdateNameBtn(!updateNameBtn);
  }

  const updatedName = () => {
    let user_id = currentUser.user._id;
    let nickname = updateName;
    ProfileService.updateName(user_id, nickname)
      .then((res) => {
        if (res.data === "資料遭到串改") {
          setCurrentUser(null);
          localStorage.removeItem("user");
          navigate("/", { replace: true });
        }
        let update = JSON.parse(localStorage.getItem("user"));
        let change = { ...update.user, nickname: updateName };

        localStorage.setItem(
          "user",
          JSON.stringify({ ...update, user: change })
        );
        setEditedName(updateName);
        setUpdateName("");
        setUpdateNameBtn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <div className="profileOuter" data-theme={theme}>
        <div className="profileContainer">
          <div className="profileBox">
            <Suspense fallback={<div className="loader">Loading...</div>}>
              <Await resolve={profileData}>
                {(loadedProfile) => (
                  <>
                    {pop === true && <SelectDP setEditedDp={setEditedDp} />}

                    <div className="profilePicOuter">
                      <img
                        className="picture"
                        src={editedDp ? editedDp : loadedProfile[0].picture}
                        alt="profilePic"
                      />
                      <span className="updatePicBtn">
                        <CustomButton
                          children="Edit"
                          onClick={() => setPop(!pop)}
                        />
                      </span>
                    </div>
                    {!currentUser && (
                      <div>
                        You must login first before getting your profile.
                      </div>
                    )}
                    {currentUser && (
                      <div className="profileInfoOuter">
                        <div className="profileName">
                          帳號：{loadedProfile[0].username}
                        </div>
                        <div className="profileName">
                          名稱：
                          <span className="name">
                            {editedName
                              ? editedName
                              : loadedProfile[0].nickname}
                          </span>
                          <CustomButton
                            children={
                              updateNameBtn === false ? "Edit" : "Cancel"
                            }
                            onClick={updateNameTrigger}
                          />
                        </div>
                        <div
                          className="updateNameOuter"
                          style={
                            updateNameBtn
                              ? { display: "block" }
                              : { display: "none" }
                          }
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <div className="updateNameContainer">
                            <input
                              className="updateForm"
                              value={updateName}
                              onChange={(e) => setUpdateName(e.target.value)}
                              placeholder="請輸入名稱..."
                            />
                            <CustomButton children="OK" onClick={updatedName} />
                          </div>
                        </div>
                        <div className="profileName">
                          職位：{loadedProfile[0].role}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
