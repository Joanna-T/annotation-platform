import React, { useLayoutEffect } from "react";
import Navbar from './common/Navbar.js';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './common/Home';
import Tasks from './curator/Tasks';
import SignInPage from './common/SignInPage';
import TasksId from './curator/TasksId';
import AssignTasks from './admin/AssignTasks';
import ActiveTasks from './admin/ActiveTasks';
import CompletedTasks from './admin/CompletedTasks';
import DisplayResults from './common/DisplayResults';
import QuestionDocuments from './common/QuestionDocuments';
import awsmobile from './aws-exports';
import Amplify, { API } from "aws-amplify"
import ReassignTasks from './admin/ReassignTasks';
import CuratorViewResults from './curator/CuratorViewResults';
import CuratorListResults from './curator/CuratorListResults';
import { Auth } from "@aws-amplify/auth"
import PageNotFound from './common/PageNotFound'
import DeleteTasks from './admin/DeleteTasks'

API.configure(awsmobile)
Auth.configure(awsmobile)
Amplify.configure(awsmobile);


function App() {

  useLayoutEffect(() => {
    // console.log = () => { };
    // console.warn = () => { };
    // console.error = () => { };

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
            <Route exact path="/delete_tasks" element={<DeleteTasks />} />
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

