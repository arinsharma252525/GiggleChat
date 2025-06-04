import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import profile from "../assets/profile.png";
import axios from "axios";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { serverUrl } from "../main";
import { RiLogoutCircleLine } from "react-icons/ri";
import {
  setOtherUsers,
  setSearchData,
  setSelectedUser,
  setUserData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  let { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);
  const [search, setsearch] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [input, setinput] = useState("");

  const handleLogout = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        {
          withCredentials: true,
        }
      );
      dispatch(setSearchData(result.data));
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (input) {
      handleSearch();
    }
  }, [input]);

  return (
    <div
      className={`lg:w-[30%] w-full lg:block h-full overflow-hidden bg-[#1e1e2e] relative ${
        !selectedUser ? "block" : "hidden"
      }`}
    >
      <div className="bg-cyan-300 shadow-gray-400 rounded-full shadow-lg overflow-hidden w-[45px] h-[45px] flex justify-center items-center cursor-pointer mt-[10px] fixed bottom-[30px] left-[10px] text-gray-700">
        <RiLogoutCircleLine
          className="w-[25px] h-[25px] cursor-pointer"
          onClick={handleLogout}
        />
      </div>
      {input.length > 0 && (
        <div className="flex w-full bg-white top-[200px] h-[300px] overflow-y-auto flex-col gap-3 absolute z-[150] items-center pt-4 rounded-2xl shadow-lg border border-cyan-200 scroll-auto">
          {searchData?.map((user) => (
            <div className="w-full flex justify-center">
              <div
                className="w-[96%] h-[56px] flex items-center gap-4 bg-white rounded-xl shadow-md border border-cyan-100 hover:bg-cyan-50 hover:scale-[1.02] transition-all duration-200 cursor-pointer px-4"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  setinput("");
                  setSearchData(false)
                }}
              >
                <div className="relative flex justify-center items-center">
                  <div className="bg-white rounded-full w-[45px] h-[45px] overflow-hidden border-2 border-cyan-300 shadow">
                    <img
                      src={user.image || profile}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  {onlineUsers?.includes(user._id) && (
                    <span className="w-4 h-4 rounded-full absolute bg-[#3aff20] right-0 bottom-0 border-2 border-white shadow" />
                  )}
                </div>
                <h1 className="text-gray-800 font-semibold text-[16px] ">
                  {user.name || user.userName}
                </h1>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full h-[200px] rounded-b-[8%] shadow-gray-400 shadow-lg flex flex-col justify-center px-[20px]">
        <h1 className="text-white font-bold text-[25px]  ">GiggleChat</h1>
        <div className="w-full flex justify-between items-center">
          <h1 className="text-cyan-300 font-bold text-[22px]">
            Hi, {userData.name || "user"}
          </h1>
          <div
            className="bg-white rounded-full border-2 border-cyan-300 shadow-gray-400 shadow-lg relative w-[60px] h-[60px] overflow-hidden cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src={userData.image || profile}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div className="w-full flex items-center gap-[20px] overflow-y-auto py-[15px]">
          {!search && (
            <div
              className="bg-white shadow-gray-400 rounded-full shadow-lg overflow-hidden w-[45px] h-[45px] flex justify-center items-center cursor-pointer mt-[15px]"
              onClick={() => setsearch(true)}
            >
              <IoIosSearch className="w-[25px] h-[25px] cursor-pointer" />
            </div>
          )}
          {search && (
            <form className="w-full h-[45px] shadow-gray-400 shadow-lg bg-white flex items-center gap-[10px] mt-[15px] rounded-full overflow-hidden px-[20px] relative">
              <IoIosSearch className="w-[25px] h-[25px]" />
              <input
                type="text"
                placeholder="find user..."
                className="w-full h-full p-[10px] border-0 text-[17px]"
                onChange={(e) => setinput(e.target.value)}
                value={input}
              />
              <RxCross2
                className="w-[25px] h-[25px] cursor-pointer"
                onClick={() => setsearch(false)}
              />
            </form>
          )}

          {!search &&
            otherUsers?.map(
              (user) =>
                onlineUsers?.includes(user._id) && (
                  <div
                    className="relative rounded-full shadow-gray-400 shadow-lg flex justify-center items-center mt-[15px] cursor-pointer"
                    onClick={() => dispatch(setSelectedUser(user))}
                  >
                    <div className="bg-white rounded-full relative w-[45px] h-[45px] overflow-hidden ">
                      <img
                        src={user.image || profile}
                        alt="profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="w-[15px] h-[15px] rounded-full absolute bg-[#3aff20] right-[-1px] bottom-[6px] shadow-gray-400 shadow-md "></span>
                  </div>
                )
            )}
        </div>
      </div>

      <div className="w-full h-[40vh] overflow-auto flex flex-col gap-[20px] items-center mt-[20px]">
        {otherUsers?.map((user) => (
          <div
            className="w-[95%] h-[50px] flex items-center gap-[20px] bg-white shadow-gray-400 shadow-lg rounded-full hover:bg-cyan-50"
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className="relative rounded-full shadow-gray-400 shadow-lg flex justify-center items-center ">
              <div className="bg-white rounded-full relative w-[45px] h-[45px] overflow-hidden ">
                <img
                  src={user.image || profile}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full border-2 border-cyan-300"
                />
              </div>
              {onlineUsers?.includes(user._id) && (
                <span className="w-[15px] h-[15px] rounded-full absolute bg-[#3aff20] right-[-1px] bottom-[6px] shadow-gray-400 shadow-md "></span>
              )}
            </div>
            <h1 className="text-gray-800 font-semibold text-[15px]">
              {user.name || user.userName}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
