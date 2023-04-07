import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { GlobalProvider } from "./context/GlobalState";
import "./styles/styles.css";

import RootLayout from "./pages/RootLayout";
import Welcome from "./pages/Welcome";
import Home, { homeDataLoader } from "./pages/Home";
import Navbar from "./pages/Navbar";
import Profile, { profileDataLoader } from "./pages/Profile";
import Video, { videoDataLoader } from "./pages/Video_testCode";
import History, { historyDataLoader } from "./pages/History";
import Redirect from "./pages/Redirect";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Welcome />}></Route>
          <Route path="/LifePlug" element={<Navbar />}>
            <Route
              index
              element={<Home />}
              loader={homeDataLoader}
              // errorElement={<Redirect />}
            ></Route>
            <Route
              path="profile"
              element={<Profile />}
              loader={profileDataLoader}
              // errorElement={<Redirect />}
            ></Route>
            <Route
              path="video/:id/:episode"
              element={<Video />}
              loader={videoDataLoader}
            ></Route>
            <Route
              path="history"
              element={<History />}
              loader={historyDataLoader}
              // errorElement={<Redirect />}
            ></Route>
          </Route>
        </Route>
      </>
    )
  );

  return (
    <GlobalProvider>
      <RouterProvider router={router} />
    </GlobalProvider>
  );
}

export default App;
