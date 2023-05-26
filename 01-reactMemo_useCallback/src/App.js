import React, { useCallback, useState } from "react";

import "./App.css";
import Child from "./Child";
import Button from "./components/UI/Button/Button";

function App() {
  const [state, setState] = useState(false);
  const [show, setShow] = useState(false);
  console.log("PARENT RUNNING");

  const handleClick = useCallback(() => {
    if (show) {
      setState((prev) => !prev);
    }
  }, [show]);

  const handleToggle = () => {
    setShow(true);
  };

  return (
    <div className="app">
      <h1>Hi there!</h1>
      <Button onClick={handleClick}> CLICK </Button>
      <Button onClick={handleToggle}>Enable Toggling</Button>
      <Child isVisible={state} />
    </div>
  );
}

export default App;
