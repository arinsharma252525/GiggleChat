import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import loggedUser from "./hooks/loggedUser";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { useDispatch, useSelector } from "react-redux";
import GetUsers from "./hooks/GetUsers";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { serverUrl } from "./main";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

const App = () => {
  loggedUser();
  GetUsers();
  let { userData, socket, onlineUsers } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?._id,
        },
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        socketio.close();
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

  return (
    <Routes>
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/profile" />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signup" />}
      />
    </Routes>
  );
};

export default App;
