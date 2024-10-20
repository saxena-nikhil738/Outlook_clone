import "./App.css";
import EmailList from "./Components/EmailList";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/emails" />} />
        <Route path="/emails" element={<EmailList />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
