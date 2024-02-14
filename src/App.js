import { useState } from "react";
import MainMint from "./MainMint";
import NavBar from "./NavBar";
import "./App.css";

function App() {
  const [accounts, setAccounts] = useState([]);
  return (
    <div className="overlay">
      <div className="App">
        {/* Prop Drilling - passing accounts ans set accounts to the below component */}
        <NavBar accounts={accounts} setAccounts={setAccounts}></NavBar>
        <MainMint accounts={accounts} setAccounts={setAccounts}></MainMint>
      </div>
      <div className="moving-background"></div>
    </div>
  );
}

export default App;
