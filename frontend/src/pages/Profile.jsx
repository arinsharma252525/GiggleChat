import React, { useRef, useState } from "react";
import profile from "../assets/profile.png";
import { TiCameraOutline } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import { setUserData } from "../redux/userSlice";

const Profile = () => {
  let userData = useSelector((state) => state.user.userData);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [name, setname] = useState(userData.name || "");
  let [frontendImage, setfrontendImage] = useState(userData.image || profile);
  let [backendImage, setbackendImage] = useState(null);
  let [saving, setsaving] = useState(false);
  let image = useRef();

  const handleImage = (e) => {
    let file = e.target.files[0];
    setbackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setsaving(true);
    try {
      let formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
      });
      setsaving(false);
      dispatch(setUserData(result.data));
      navigate("/")
      if (result.data.image) {
        setfrontendImage(result.data.image);
      }
    } catch (error) {
      console.log(error);
      setsaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1e1e2e] flex justify-center items-center">
      <div className="w-full max-w-[400px] h-[540px] bg-[#2a2e39] rounded-lg  shadow-gray-400 shadow-lg flex flex-col items-center justify-center relative">
        <div
          className="absolute top-4 right-4 text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          <MdCancel className="w-[40px] h-[40px]" />
        </div>
        <div
          className="bg-white rounded-full border-4 border-cyan-300 shadow-gray-400 shadow-lg relative w-[200px] h-[200px] flex items-center justify-center mx-auto mt-2"
          onClick={() => image.current.click()}
        >
          <img
            src={frontendImage}
            alt="profile"
            className="w-full h-full object-cover rounded-full"
          />
          <TiCameraOutline className="absolute bottom-4 right-4 text-3xl text-cyan-400 bg-white rounded-full p-1 cursor-pointer shadow" />
        </div>
        <form
          className="w-[95%] max-w-[500px] flex flex-col gap-[20px] items-center justify-center"
          onSubmit={handleProfile}
        >
          <input
            type="file"
            accept="image/*"
            ref={image}
            hidden
            onChange={handleImage}
          />

          <input
            type="text"
            placeholder="Enter your name"
            className="w-[90%] h-[40px] outline-none border-none px-[20px] py-[10px] mt-4 bg-white rounded-lg shadow-gray-200 shadow-md hover:shadow-inner mx-auto text-black"
            onChange={(e) => setname(e.target.value)}
            value={name}
          />
          <input
            type="text"
            readOnly
            className="w-[90%] h-[40px] outline-none border-none px-[20px] py-[10px] mt-4 bg-white rounded-lg shadow-gray-200 shadow-md hover:shadow-inner mx-auto text-gray-400"
            value={userData?.userName}
          />
          <input
            type="email"
            readOnly
            className="w-[90%] h-[40px] outline-none border-none px-[20px] py-[10px] mt-4 bg-white rounded-lg shadow-gray-200 shadow-md hover:shadow-inner mx-auto text-gray-400"
            value={userData?.email}
          />
          <button
            className="w-[200px] h-[40px] px-[20px] py-[10px] bg-cyan-300 rounded-2xl shadow-gray-400 shadow-md mt-2 font-semibold hover:shadow-inner"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
