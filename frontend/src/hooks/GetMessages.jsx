import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";

const GetMessages = () => {
  let dispatch = useDispatch();
  let { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!selectedUser){
      return;
    }
    const fetchMessages = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/message/get/${selectedUser._id}`, {
          withCredentials: true,
        });
        dispatch(setMessages(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedUser, userData]);
};

export default GetMessages;