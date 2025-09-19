import { useState } from "react";
import Questionnaire from "./components/Questionnaire";
import MentorQuestionnaire from "./components/MentorQuestionnaire";
import SignUp from "./components/SignUp";
import UserTypeSelection from "./components/UserTypeSelection";
import "./App.css";

type ViewType = "signup" | "userType" | "menteeQuestionnaire" | "mentorQuestionnaire";

function App() {
  const [currentView, setCurrentView] = useState<ViewType>("signup");
  const [userType, setUserType] = useState<"mentor" | "mentee" | null>(null);

  const handleSignUpComplete = () => {
    setCurrentView("userType");
  };

  const handleUserTypeSelected = (selectedUserType: "mentor" | "mentee") => {
    setUserType(selectedUserType);
    if (selectedUserType === "mentee") {
      setCurrentView("menteeQuestionnaire");
    } else {
      setCurrentView("mentorQuestionnaire");
    }
  };

  const handleBackToSignUp = () => {
    setCurrentView("signup");
    setUserType(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "signup":
        return <SignUp onSignUpComplete={handleSignUpComplete} />;
      case "userType":
        return <UserTypeSelection onUserTypeSelected={handleUserTypeSelected} />;
      case "menteeQuestionnaire":
        return <Questionnaire onBackToSignUp={handleBackToSignUp} />;
      case "mentorQuestionnaire":
        return <MentorQuestionnaire onBackToSignUp={handleBackToSignUp} />;
      default:
        return <SignUp onSignUpComplete={handleSignUpComplete} />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderCurrentView()}
    </div>
  );
}

export default App;
