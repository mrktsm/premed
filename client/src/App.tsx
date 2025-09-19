import { useState, useEffect } from "react";
import Questionnaire from "./components/Questionnaire";
import MentorQuestionnaire from "./components/MentorQuestionnaire";
import SignUp from "./components/SignUp";
import "./App.css";

type ViewType = "signup" | "menteeQuestionnaire" | "mentorQuestionnaire";

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("signup");

  // Check URL path to determine initial view
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/mentor") {
      setCurrentView("mentorQuestionnaire");
    } else if (path === "/mentee") {
      setCurrentView("menteeQuestionnaire");
    } else if (path === "/signup") {
      setCurrentView("signup");
    } else {
      // Default to signup for root path
      setCurrentView("signup");
    }
  }, []);

  const handleSignUpComplete = () => {
    // Default to mentee questionnaire after signup
    setCurrentView("menteeQuestionnaire");
    window.history.pushState(null, "", "/mentee");
  };

  const handleBackToSignUp = () => {
    setCurrentView("signup");
    window.history.pushState(null, "", "/signup");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "signup":
        return <SignUp onSignUpComplete={handleSignUpComplete} />;
      case "menteeQuestionnaire":
        return <Questionnaire onBackToSignUp={handleBackToSignUp} />;
      case "mentorQuestionnaire":
        return <MentorQuestionnaire onBackToSignUp={handleBackToSignUp} />;
      default:
        return <SignUp onSignUpComplete={handleSignUpComplete} />;
    }
  };

  return <div className="w-full h-full">{renderCurrentView()}</div>;
}

export default App;
