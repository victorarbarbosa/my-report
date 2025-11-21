import { Routes, Route } from "react-router-dom";
import Initial from "./Initial";
import Home from "./Home";
import "./App.css";
import Profile from './Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Initial />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />}/>
    </Routes>
  );
}
