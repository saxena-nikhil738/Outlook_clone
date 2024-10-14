import logo from "./logo.svg";
import "./App.css";
import EmailList from "./Components/EmailList";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <EmailList />
      <Routes>
        <Route path="/emaillist" element={<EmailList />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
