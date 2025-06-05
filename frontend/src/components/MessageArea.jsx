import React, { useRef, useState } from "react";
import profile from "../assets/profile.png";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import { RiEmojiStickerFill } from "react-icons/ri";
import { FaImages } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import { useEffect } from "react";

const MessageArea = () => {
  let { selectedUser, userData, socket } = useSelector((state) => state.user);
  let dispatch = useDispatch();
  let [showPicker, setShowPicker] = useState(false);
  let [input, setInput] = useState("");
  let [frontendImage, setfrontendImage] = useState(null);
  let [backendImage, setbackendImage] = useState(null);
  let image = useRef();
  let { messages } = useSelector((state) => state.message);

  const handleImage = (e) => {
    let file = e.target.files[0];
    setbackendImage(file);
    setfrontendImage(URL.createObjectURL(file));
  };

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.length == 0 && backendImage == null) {
      return;
    }
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setfrontendImage(null);
      setbackendImage(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]));
    });
    return () => socket.off("newMessage");
  }, [messages, setMessages]);

  return (
    <div
      className={`lg:w-[70%] ${
        selectedUser ? "flex" : "hidden"
      } lg:flex w-full h-full bg-[#1e1e2e] relative border-l-2 border-white`}
    >
      {selectedUser && (
        <div className="w-full h-[100vh] flex flex-col bg-slate-200">
          <div className="w-full h-[100px] flex items-center bg-[#1e1e2e]  px-[20px] gap-[20px]">
            <div
              className="cursor-pointer text-white "
              onClick={() => dispatch(setSelectedUser(null))}
            >
              <IoIosArrowRoundBack className="w-[40px] h-[40px]" />
            </div>
            <div className="bg-white rounded-full border-2 border-cyan-300 shadow-gray-400 shadow-lg relative w-[50px] h-[50px] overflow-hidden cursor-pointer">
              <img
                src={selectedUser?.image || profile}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h1 className="text-white font-semibold text-[15px]">
              {selectedUser?.name || "user"}
            </h1>
          </div>

          <div className="w-full h-[70%] flex flex-col py-[60px] px-[20px] overflow-auto gap-[20px]">
            {showPicker && (
              <div className="absolute bottom-[120px] lg:left-[160px] left-[20px]">
                <EmojiPicker
                  width={250}
                  height={350}
                  className="shadow-lg z-[100]"
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}
            {messages &&
              messages.map((mess) =>
                mess.sender == userData._id ? (
                  <SenderMessage image={mess.image} message={mess.message} />
                ) : (
                  <ReceiverMessage image={mess.image} message={mess.message} />
                )
              )}
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="w-full lg:w-[70%] h-[100px] fixed bottom-[20px] flex items-center justify-center ">
          {frontendImage && (
            <img
              src={frontendImage}
              alt=""
              className="w-[140px] absolute right-[20%] bottom-[100px] rounded-lg shadow-gray-400 shadow-lg"
            />
          )}
          <form
            className="w-[95%] lg:w-[70%] h-[60px] bg-[#1e1e2e] rounded-full shadow-gray-400 shadow-lg flex items-center gap-[20px] px-[20px]"
            onSubmit={handleSendMessage}
          >
            <div onClick={() => setShowPicker((prev) => !prev)}>
              <RiEmojiStickerFill className="w-[25px] h-[25px] text-white cursor-pointer" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={image}
              hidden
              onChange={handleImage}
            />
            <input
              type="text"
              className="w-full h-full px-[10px] outline-none border-0 text-[19px] text-white cursor-pointer placeholder-white"
              placeholder="Type a message"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <div onClick={() => image.current.click()}>
              <FaImages className="cursor-pointer w-[25px] h-[25px] text-white" />
            </div>
            {(input.length > 0 || backendImage) && (
              <button>
                <IoMdSend className="cursor-pointer w-[25px] h-[25px] text-white" />
              </button>
            )}
          </form>
        </div>
      )}

      {!selectedUser && (
        <div className="w-full h-full flex flex-col justify-center items-center ">
          <img
            src="/logo.png"
            alt="GiggleChat Logo"
            className="w-[180px] h-[180px]"
          />
          <span className="text-white font-semibold text-[30px]">
            Where every message brings a smile!
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
