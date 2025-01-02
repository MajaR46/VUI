import "./App.css";
import Home from "./components/Home";
import Jobs from "./components/Jobs/AllJobs";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PostJob from "./components/Jobs/PostJob";
import SaveJobs from "./components/Jobs/SaveJobs";
import ErrorPage from "./components/ErrorPage";
import ApplyJobs from "./components/Jobs/ApplyJobs";
import Projects from "./components/Projects/DiscoverProjects";
import AddProject from "./components/Projects/AddProjects";
import Profile from "./components/Users/Profile";
import Register from "./components/Users/Registration";
import Login from "./components/Users/Login";
import SendInquiry from "./components/SendInquiry";
import MyProjects from "./components/Projects/MyProjects";
import SessionManager from "./components/SessionManager";
import MyJobs from "./components/Jobs/MyJobs";
import EditProject from "./components/Projects/EditProject";
import MyProjects2 from "./components/Projects/MyProjects2";

function App() {
  
  return (
    <>
      <BrowserRouter>
        <SessionManager>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/apply-jobs" element={<ApplyJobs />} />
              <Route path="/saved-job" element={<SaveJobs />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/add-projects" element={<AddProject />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/registration" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-projects" element={<MyProjects />} />
              <Route path="/my-projects2" element={<MyProjects2/>}/>
              <Route path="/my-jobs" element={<MyJobs />} />
              <Route path="/send-inquiry" element={<SendInquiry />} />
              <Route path="/edit-project/:id" element={<EditProject />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </SessionManager>
      </BrowserRouter>
    </>
  );
}

export default App;
