import React, { Suspense } from "react";
import { GlobalContext } from "../context/GlobalState";
import SelectDP from "../components/profilePage/SelectDP";
import ProfileService from "../services/profile.service";
import {
  useNavigate,
  useLoaderData,
  defer,
  Await,
  useFetcher,
} from "react-router-dom";

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

export async function profileAction({ request }) {
  let formData = await request.formData();
  let updatedName = Object.fromEntries(formData);
  let user_id = JSON.parse(localStorage.getItem("user")).user._id;

  await ProfileService.updateName(user_id, updatedName.nickname).then((res) => {
    let update = JSON.parse(localStorage.getItem("user"));
    let change = { ...update.user, nickname: updatedName };

    localStorage.setItem("user", JSON.stringify({ ...update, user: change }));
  });

  return updatedName.nickname;
}

export default function Profile() {
  const { profileData } = useLoaderData();
  const { currentUser, setCurrentUser, pop, setPop, theme } =
    React.useContext(GlobalContext);
  const [updateNameBtn, setUpdateNameBtn] = React.useState(false);
  const [updateName, setUpdateName] = React.useState("");
  const [editedDp, setEditedDp] = React.useState(null);
  let navigate = useNavigate();

  function updateNameTrigger() {
    setUpdateNameBtn(!updateNameBtn);
  }

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
                            {loadedProfile[0].nickname}
                          </span>
                          <CustomButton
                            children={
                              updateNameBtn === false ? "Edit" : "Cancel"
                            }
                            onClick={updateNameTrigger}
                          />
                        </div>
                        {/* hi */}
                        {updateNameBtn && (
                          <div className="updateNameOuter">
                            <NameField setUpdateNameBtn={setUpdateNameBtn} />
                          </div>
                        )}
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

function NameField({ setUpdateNameBtn }) {
  const fetcher = useFetcher();
  function closeBtn() {
    console.log("hi");
  }
  if (fetcher.formData) {
    console.log(fetcher.formData.get("nickname"));
  }
  return (
    <>
      <fetcher.Form method="post" className="updateNameContainer">
        <input
          type="text"
          className="updateForm"
          name="nickname"
          placeholder="請輸入名稱..."
        />
        <CustomButton children="OK" onClick={() => closeBtn()} />
      </fetcher.Form>
    </>
  );
}
