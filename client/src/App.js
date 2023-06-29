import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import Navbar from "./components/Navbar"
import {BrowserRouter,Routes,Route,useNavigate,useLocation} from "react-router-dom"
import Home from "./components/screens/Home"
import SignIn from "./components/screens/Login"
import Profile from "./components/screens/Profile"
import UserProfile from './components/screens/UserProfile'
import SignUp from "./components/screens/Signup"
import CreateRecipe from "./components/screens/CreateRecipe"
import SubscribedUserRecipe from './components/screens/SubscribesUserRecipe'
import {reducer,initialState} from './reducers/userReducer'
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';
import Menu from "./components/screens/Menu"
import South from "./components/screens/South"
import North from "./components/screens/North"
import Chinese from './components/screens/Chinese';
import Continental from './components/screens/Continental';
export const UserContext = createContext()

const Routing = ()=>{
  const navigate = useNavigate()
  const location = useLocation()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!location.pathname.startsWith('/reset'))
      navigate("/login")
    }
  },[])
  return(
    <Routes>
      <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/menu" element={<Menu />} /> 
        <Route path="/menu/south" element={<South/>} /> 
        <Route path="/menu/north" element={<North/>} /> 
        <Route path="/menu/chinese" element={<Chinese/>} /> 
        <Route path="/menu/continental" element={<Continental/>} /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create" element={<CreateRecipe />} /> 
        <Route path="/profile/:userid" element={<UserProfile />} /> 
        <Route path="/myfollowingpost" element={<SubscribedUserRecipe/>} />
        <Route exact path="/reset" element={<Reset />} />
        <Route path="/reset/:token" element={<NewPassword />} /> 
    </Routes>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing />  
    </BrowserRouter>
    </UserContext.Provider>
  );
}



export default App;
