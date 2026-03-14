import Router from "./router/Router";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router />

      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}

export default App;
