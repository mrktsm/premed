import { useState } from "react";

interface UserTypeSelectionProps {
  onUserTypeSelected: (userType: "mentor" | "mentee") => void;
}

const UserTypeSelection = ({ onUserTypeSelected }: UserTypeSelectionProps) => {
  const [selectedType, setSelectedType] = useState<"mentor" | "mentee" | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onUserTypeSelected(selectedType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/20 relative overflow-hidden">
      {/* Background blob */}
      <div className="absolute -top-48 -left-[10%] md:left-[15%] w-[500px] h-96 bg-gradient-to-br from-primary-200/40 via-primary-300/30 to-primary-100/20 rounded-full blur-2xl opacity-60"></div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Are you looking for mentorship or ready to become a mentor?
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Mentee Card */}
            <div
              className={`p-8 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedType === "mentee"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-white hover:border-primary-300"
              }`}
              onClick={() => setSelectedType("mentee")}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  I'm a Mentee
                </h3>
                <p className="text-gray-600 mb-4">
                  Pre-med student seeking guidance and mentorship for medical school applications
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Get matched with experienced mentors</li>
                  <li>• Receive personalized guidance</li>
                  <li>• Navigate the medical school process</li>
                </ul>
              </div>
            </div>

            {/* Mentor Card */}
            <div
              className={`p-8 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedType === "mentor"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 bg-white hover:border-primary-300"
              }`}
              onClick={() => setSelectedType("mentor")}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  I'm a Mentor
                </h3>
                <p className="text-gray-600 mb-4">
                  Medical professional ready to guide and support pre-med students
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• Share your medical journey</li>
                  <li>• Guide future physicians</li>
                  <li>• Make a meaningful impact</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`px-12 py-4 text-lg rounded-lg font-medium transition-all duration-200 ${
              selectedType
                ? "bg-primary-500 text-white hover:bg-primary-600 focus:outline-none"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
