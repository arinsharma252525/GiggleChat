import { useEffect } from "react";
import { useRef } from "react";
import profile from "../assets/profile.png";
import { useSelector } from "react-redux";

const ReceiverMessage = ({ image, message }) => {
  let scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImageScroll=()=>{
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }

  let { userData } = useSelector((state)=>state.user);
  let {selectedUser} = useSelector((state)=>state.user)

  return (
    <div className="w-fit lg:max-w-[700px] max-w-[250px] px-[20px] py-[10px] bg-cyan-700 text-white text-[19px] rounded-tl-none rounded-2xl relative left-20 shadow-gray-400 shadow-lg gap-[20px] flex flex-col">
      <div
              className="bg-white rounded-full border-2 border-cyan-300 shadow-gray-400 shadow-lg absolute top-0 lg:left-[-50px] left-[-60px] w-[40px] h-[40px] overflow-hidden cursor-pointer flex justify-center items-center"
            >
              <img
                src={selectedUser.image || profile}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
      <div ref={scroll}>
        {image && <img src={image} alt="" className="w-[140px] rounded-lg" onLoad={handleImageScroll} />}
        {message && <span className="break-words lg:max-w-[300px] max-w-[200px]">{message}</span>}
      </div>
    </div>
  );
};

export default ReceiverMessage;
