import { Routes, Route } from "react-router-dom";
import Initial from "./Initial";
import Home from "./Home";
import "./App.css"
import SignUp from "./SignUp";
import Profile from './Profile'
import ReportDetails from "./ReportDetails";
import SearchResults from "./SearchResults";
import AIChat from "./AIChat";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Initial />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />}/>
      <Route path="/profile/:id" element={<Profile />}/>
      <Route path="/report/:id" element={<ReportDetails />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/ai-chat" element={<AIChat />} />
    </Routes>
  );
}
