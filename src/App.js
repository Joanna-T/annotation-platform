import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar.js';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Home';
import Tasks from './Tasks';
import awsmobile from './aws-exports';
//import Signin from './Signin';
import SignInPage from './SignInPage';
import TasksId from './TasksId';
import AssignTasks from './AssignTasks';
import ActiveTasks from './ActiveTasks';
import CompletedTasks from './CompletedTasks';
import DisplayResults from './DisplayResults';
import QuestionDocuments from './QuestionDocuments';
//import awsmobile from './aws-exports';
import Amplify from "aws-amplify"
import ReassignTasks from './ReassignTasks';
import CuratorViewResults from './CuratorViewResults';
import CuratorListResults from './CuratorListResults';
// import { Authenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';
//Amplify.configure(awsmobile);

function App() {
  return (
    <Router> 
      <div className="App">
      <Navbar />
      <div className="content">
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/annotation_tasks" element={<Tasks/>}/>
          <Route exact path="/sign_in" element={<SignInPage/>}/>
          <Route exact path="/annotation_tasks/:id" element={<TasksId/>}/>
          <Route exact path="/assign_tasks" element={<AssignTasks/>}/>
          <Route exact path="/active_tasks/:questions/:id" element={<DisplayResults/>}/>
          <Route exact path="/active_tasks/:id" element={<QuestionDocuments/>}/>
          <Route exact path="/active_tasks" element={<ActiveTasks/>}/>
          <Route exact path="/reassign_tasks" element={<ReassignTasks/>}/>
          <Route exact path="/completed_tasks" element={<CompletedTasks/>}/>
          <Route exact path="/completed_curator_tasks" element={<CuratorListResults/>}/>
          <Route exact path="/completed_curator_tasks/:id" element={<CuratorViewResults/>}/>
        </Routes>
      </div>
      </div>
    </Router>
    
  );
}

export default App;
