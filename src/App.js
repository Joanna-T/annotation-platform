import logo from './logo.svg';
import './App.css';
import React, { useLayoutEffect } from "react";
import Navbar from './Navbar.js';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home';
import Tasks from './Tasks';
import SignInPage from './SignInPage';
import TasksId from './TasksId';
import AssignTasks from './admin/AssignTasks';
import ActiveTasks from './admin/ActiveTasks';
import CompletedTasks from './admin/CompletedTasks';
import DisplayResults from './admin/DisplayResults';
import QuestionDocuments from './QuestionDocuments';
import awsmobile from './aws-exports';
import Amplify, { API } from "aws-amplify"
import ReassignTasks from './ReassignTasks';
import CuratorViewResults from './curator/CuratorViewResults';
import CuratorListResults from './curator/CuratorListResults';
import { Auth } from "@aws-amplify/auth"
import PageNotFound from './PageNotFound'


API.configure(awsmobile)
Auth.configure(awsmobile)
Amplify.configure(awsmobile);


function App() {
  useLayoutEffect(() => {
    console.log = () => { };
    console.warn = () => { };
    console.error = () => { };

    console.error('Something bad happened.');
  }, []);
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/annotation_tasks" element={<Tasks />} />
            <Route exact path="/sign_in" element={<SignInPage />} />
            <Route exact path="/annotation_tasks/:id" element={<TasksId />} />
            <Route exact path="/assign_tasks" element={<AssignTasks />} />
            <Route exact path="/active_tasks/:questions/results" element={<DisplayResults />} />
            <Route exact path="/active_tasks/:id" element={<QuestionDocuments />} />
            <Route exact path="/active_tasks" element={<ActiveTasks />} />
            <Route exact path="/reassign_tasks" element={<ReassignTasks />} />
            <Route exact path="/completed_tasks/:questions/results" element={<DisplayResults />} />
            <Route exact path="/completed_tasks/:id" element={<QuestionDocuments />} />
            <Route exact path="/completed_tasks" element={<CompletedTasks />} />
            <Route exact path="/completed_curator_tasks" element={<CuratorListResults />} />
            <Route exact path="/completed_curator_tasks/:id" element={<CuratorViewResults />} />
            <Route path="*" element={<PageNotFound />} />

          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
