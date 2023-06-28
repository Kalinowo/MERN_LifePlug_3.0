import React from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";

const navigation = [
  { name: "Home", href: "/LifePlug" },
  { name: "Profile", href: "/LifePlug/profile" },
  { name: "History", href: "/LifePlug/history" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { currentUser, setCurrentUser, theme, switchTheme } =
    React.useContext(GlobalContext);
  let location = useLocation();
  let navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
    }
  }, [currentUser]);

  function logout() {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/", { replace: true });
  }

  return (
    <>
      <Disclosure as="nav" className="bg-gray-200">
        {({ open }) => (
          <>
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/LifePlug">
                      <div className="font-black text-4xl">LifePlug</div>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.href === location.pathname
                              ? "bg-gray-900 text-white text-xl"
                              : "text-black hover:bg-gray-700 hover:text-white text-xl",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-grow justify-end items-center gap-5 hidden sm:flex">
                    <Link to="/" onClick={() => logout()}>
                      <button className="text-black text-xl">登出</button>
                    </Link>
                    <label className="themeSwitch">
                      <input
                        type="checkbox"
                        data-theme={theme}
                        onClick={() => switchTheme()}
                      />
                      <span>
                        <img src="material/pic_sun.svg" alt="moon" />
                        <img src="material/pic_moon.svg" alt="moon" />
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    as="a"
                    to={item.href}
                    className={classNames(
                      item.current === location.pathname
                        ? "bg-gray-900 text-white"
                        : "text-black hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col">
                  <Link
                    to="/"
                    className="text-black hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                    onClick={() => logout()}
                  >
                    <button className="text-lg">登出</button>
                  </Link>
                  <label className="themeSwitch ml-3">
                    <input
                      type="checkbox"
                      data-theme={theme}
                      onClick={() => switchTheme()}
                    />
                    <span>
                      <img src="material/pic_sun.svg" alt="moon" />
                      <img src="material/pic_moon.svg" alt="moon" />
                    </span>
                  </label>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Outlet />
    </>
  );
}
