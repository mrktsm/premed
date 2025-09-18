import { useState } from "react";
import Questionnaire from "./components/Questionnaire";
import SignUp from "./components/SignUp";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState<"signup" | "questionnaire">(
    "signup"
  );

  const handleSignUpComplete = () => {
    setCurrentView("questionnaire");
  };

  const handleBackToSignUp = () => {
    setCurrentView("signup");
  };

  return (
    <div className="w-full h-full">
      {currentView === "signup" ? (
        <SignUp onSignUpComplete={handleSignUpComplete} />
      ) : (
        <Questionnaire onBackToSignUp={handleBackToSignUp} />
      )}
    </div>
  );
}

export default App;
