import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <>
      {!sessionId ? (
        <Login onLogin={setSessionId} />
      ) : (
        <Dashboard sessionId={sessionId} />
      )}
    </>
  );
}

export default App;