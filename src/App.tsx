import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { KanbanContainer } from "./components/kanban";
import Navbar from "./components/navbar/Navbar";
import Projects from "./components/projects/Projects";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="p-4 ">
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/projects/:id" element={<KanbanContainer />} />
            {/* <Route path="/groups" element={<Groups />} /> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
