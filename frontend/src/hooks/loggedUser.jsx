import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const loggedUser = () => {
  let dispatch = useDispatch();
  let {userData} = useSelector((state) => state.user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(`${serverUrl}/api/user/loggeduser`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
};

export default loggedUser;
