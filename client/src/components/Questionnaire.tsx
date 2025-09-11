import { useState } from "react";

interface FormData {
  university: string;
  year: string;
  hasUniversity: boolean;
  academicFocus: string;
  gpa: string;
  hasGpa: boolean;
  careerGoals: string[];
  extracurriculars: string[];
}

const Questionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    university: "",
    year: "",
    hasUniversity: false,
    academicFocus: "",
    gpa: "",
    hasGpa: false,
    careerGoals: [],
    extracurriculars: [],
  });

  const totalSteps = 6;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps && !isLoading) {
      setIsLoading(true);

      // Simulate loading for 0.6 seconds
      await new Promise((resolve) => setTimeout(resolve, 600));

      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.hasUniversity || formData.university.trim() !== "";
      case 2:
        return formData.year !== "";
      case 3:
        return formData.academicFocus !== "";
      case 4:
        return formData.hasGpa || formData.gpa.trim() !== "";
      case 5:
        return formData.careerGoals.length > 0;
      case 6:
        return formData.extracurriculars.length > 0;
      default:
        return true;
    }
  };

  const yearOptions = [
    { value: "freshman", label: "Freshman (1st Year)" },
    { value: "sophomore", label: "Sophomore (2nd Year)" },
    { value: "junior", label: "Junior (3rd Year)" },
    { value: "senior", label: "Senior (4th Year)" },
    { value: "graduate", label: "Graduate Student" },
    { value: "post-grad", label: "Post-Graduate" },
  ];

  const academicFocusOptions = [
    { value: "biology", label: "Biology" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biochemistry", label: "Biochemistry" },
    { value: "neuroscience", label: "Neuroscience" },
    { value: "psychology", label: "Psychology" },
    { value: "other", label: "Other" },
  ];

  const careerGoalOptions = [
    { value: "physician", label: "Physician (MD)" },
    { value: "surgeon", label: "Surgeon" },
    { value: "researcher", label: "Medical Researcher" },
    { value: "pediatrician", label: "Pediatrician" },
    { value: "psychiatrist", label: "Psychiatrist" },
    { value: "other", label: "Other Medical Field" },
  ];

  const extracurricularOptions = [
    { value: "volunteer", label: "Hospital Volunteering" },
    { value: "research", label: "Research Experience" },
    { value: "shadowing", label: "Physician Shadowing" },
    { value: "leadership", label: "Leadership Roles" },
    { value: "tutoring", label: "Tutoring/Teaching" },
    { value: "athletics", label: "Athletics/Sports" },
  ];

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              University and Year
            </h1>
            <div className="space-y-2">
              <div>
                <label
                  className="m-0 inline-flex items-center text-sm font-medium mb-2 text-gray-700"
                  htmlFor="university-input"
                >
                  Current University
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter your university name"
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    id="university-input"
                    value={formData.university}
                    onChange={(e) =>
                      updateFormData("university", e.target.value)
                    }
                    disabled={formData.hasUniversity}
                  />
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="no-university-checkbox"
                    type="checkbox"
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-primary-300 rounded accent-primary-500"
                    checked={formData.hasUniversity}
                    onChange={(e) =>
                      updateFormData("hasUniversity", e.target.checked)
                    }
                  />
                </div>
                <label
                  className="m-0 inline-flex items-center text-sm ml-2 text-gray-600"
                  htmlFor="no-university-checkbox"
                >
                  I'm not currently enrolled in university.
                </label>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Academic Year
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What year are you in?
              </div>
              <div className="flex flex-wrap items-center">
                {yearOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-between space-x-2 rounded-lg border-2 p-4 shadow-sm focus:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-2 hover:border-primary-400 py-1 pl-1 pr-2 ${
                      formData.year === option.value
                        ? "border-primary-500"
                        : "border-gray-200"
                    }`}
                    onClick={() => updateFormData("year", option.value)}
                  >
                    <span>
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-primary-100 p-2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-primary-600"
                          >
                            <path
                              d="M12 2L3 7L12 12L21 7L12 2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 17L12 22L21 17"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 12L12 17L21 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </span>
                    {formData.year === option.value && (
                      <svg
                        viewBox="0 0 4.233 4.233"
                        className="order-1 ml-2 h-4 w-4 shrink-0 text-primary-600"
                      >
                        <path
                          d="M2.117 0a2.117 2.117 0 110 4.233 2.117 2.117 0 010-4.233zM3.1 1.755a.253.253 0 10-.358-.358l-.895.895-.358-.358a.253.253 0 10-.358.358l.537.537a.253.253 0 00.358 0z"
                          fill="currentColor"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Academic Focus
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What's your major or area of study?
              </div>
              <div className="flex flex-wrap items-center">
                {academicFocusOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-between space-x-2 rounded-lg border-2 p-4 shadow-sm focus:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-2 hover:border-primary-400 py-1 pl-1 pr-2 ${
                      formData.academicFocus === option.value
                        ? "border-primary-500"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      updateFormData("academicFocus", option.value)
                    }
                  >
                    <span>
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-primary-100 p-2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-primary-600"
                          >
                            <path
                              d="M22 10V6C22 5.45 21.55 5 21 5H3C2.45 5 2 5.45 2 6V10C2 10.55 2.45 11 3 11H21C21.55 11 22 10.55 22 10Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M7 19H17L19 13H5L7 19Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </span>
                    {formData.academicFocus === option.value && (
                      <svg
                        viewBox="0 0 4.233 4.233"
                        className="order-1 ml-2 h-4 w-4 shrink-0 text-primary-600"
                      >
                        <path
                          d="M2.117 0a2.117 2.117 0 110 4.233 2.117 2.117 0 010-4.233zM3.1 1.755a.253.253 0 10-.358-.358l-.895.895-.358-.358a.253.253 0 10-.358.358l.537.537a.253.253 0 00.358 0z"
                          fill="currentColor"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Academic Performance
            </h1>
            <div className="space-y-2">
              <div>
                <label
                  className="m-0 inline-flex items-center text-sm font-medium mb-2 text-gray-700"
                  htmlFor="gpa-input"
                >
                  Current GPA
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="e.g., 3.8"
                    className="w-full px-4 py-3 border border-primary-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                    id="gpa-input"
                    value={formData.gpa}
                    onChange={(e) => updateFormData("gpa", e.target.value)}
                    disabled={formData.hasGpa}
                  />
                </div>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="no-gpa-checkbox"
                    type="checkbox"
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-primary-300 rounded accent-primary-500"
                    checked={formData.hasGpa}
                    onChange={(e) => updateFormData("hasGpa", e.target.checked)}
                  />
                </div>
                <label
                  className="m-0 inline-flex items-center text-sm ml-2 text-gray-600"
                  htmlFor="no-gpa-checkbox"
                >
                  I prefer not to share my GPA.
                </label>
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Career Goals
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What are your medical career interests? (Select all that apply)
              </div>
              <div className="flex flex-wrap items-center">
                {careerGoalOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-between space-x-2 rounded-lg border-2 p-4 shadow-sm focus:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-2 hover:border-primary-400 py-1 pl-1 pr-2 ${
                      formData.careerGoals.includes(option.value)
                        ? "border-primary-500"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      updateFormData(
                        "careerGoals",
                        toggleArrayValue(formData.careerGoals, option.value)
                      )
                    }
                  >
                    <span>
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-primary-100 p-2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-primary-600"
                          >
                            <path
                              d="M19 14C20.49 14 22 15.5 22 17V20H2V17C2 15.5 3.51 14 5 14H19Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </span>
                    {formData.careerGoals.includes(option.value) && (
                      <svg
                        viewBox="0 0 4.233 4.233"
                        className="order-1 ml-2 h-4 w-4 shrink-0 text-primary-600"
                      >
                        <path
                          d="M2.117 0a2.117 2.117 0 110 4.233 2.117 2.117 0 010-4.233zM3.1 1.755a.253.253 0 10-.358-.358l-.895.895-.358-.358a.253.253 0 10-.358.358l.537.537a.253.253 0 00.358 0z"
                          fill="currentColor"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 6:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Experience & Activities
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                What extracurricular activities are you involved in? (Select all
                that apply)
              </div>
              <div className="flex flex-wrap items-center">
                {extracurricularOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-between space-x-2 rounded-lg border-2 p-4 shadow-sm focus:outline-none focus-visible:ring focus-visible:ring-primary-200 focus-visible:ring-offset-2 hover:border-primary-400 py-1 pl-1 pr-2 ${
                      formData.extracurriculars.includes(option.value)
                        ? "border-primary-500"
                        : "border-gray-200"
                    }`}
                    onClick={() =>
                      updateFormData(
                        "extracurriculars",
                        toggleArrayValue(
                          formData.extracurriculars,
                          option.value
                        )
                      )
                    }
                  >
                    <span>
                      <div className="flex items-center space-x-3">
                        <div className="rounded-lg bg-primary-100 p-2">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-primary-600"
                          >
                            <path
                              d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                        <span>{option.label}</span>
                      </div>
                    </span>
                    {formData.extracurriculars.includes(option.value) && (
                      <svg
                        viewBox="0 0 4.233 4.233"
                        className="order-1 ml-2 h-4 w-4 shrink-0 text-primary-600"
                      >
                        <path
                          d="M2.117 0a2.117 2.117 0 110 4.233 2.117 2.117 0 010-4.233zM3.1 1.755a.253.253 0 10-.358-.358l-.895.895-.358-.358a.253.253 0 10-.358.358l.537.537a.253.253 0 00.358 0z"
                          fill="currentColor"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/20 relative overflow-hidden">
      {/* Background blob - half circle behind header */}
      <div className="absolute -top-48 left-[15%] w-[500px] h-96 bg-gradient-to-br from-primary-200/40 via-primary-300/30 to-primary-100/20 rounded-full blur-2xl opacity-60"></div>

      {/* Header */}
      <div className="relative z-10 border-b border-primary-100/50 bg-white/80 backdrop-blur-sm w-full">
        <div className="w-full py-8 px-8">
          {/* Header content will go here */}
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-transparent">
          <div
            className={`h-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-500 ease-out ${
              isLoading ? "animate-pulse" : ""
            }`}
            style={{
              width: isLoading ? "100%" : "0%",
              transition: isLoading
                ? "width 0.6s ease-out"
                : "width 0.3s ease-out",
            }}
          ></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 py-12 w-full">
        <div className="max-w-4xl mx-auto px-8">
          {/* Step indicator in top-left */}
          <div className="mb-8">
            <span className="inline-block rounded-full border border-primary-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm text-primary-700 font-medium shadow-sm">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <div className="space-y-8">{renderStep()}</div>

          <div className="flex justify-between items-center mt-12">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 text-base rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 backdrop-blur-sm"
              >
                Previous
              </button>
            )}

            <div className="flex-1"></div>

            <button
              disabled={!isStepValid() || isLoading}
              onClick={
                currentStep === totalSteps
                  ? () => console.log("Form submitted:", formData)
                  : handleNext
              }
              className={`px-12 py-3 text-base rounded-lg font-medium focus:outline-none ${
                isStepValid() && !isLoading
                  ? "bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-400"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentStep === totalSteps ? "Complete" : "Next"}
            </button>
          </div>

          <hr className="my-8 border-primary-100" />

          <div className="flex items-start justify-between space-x-4 rounded-lg border p-6 text-sm bg-primary-50/50 text-primary-800 border-primary-200/50 backdrop-blur-sm">
            <div className="flex">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3 mt-0.5 hidden h-5 w-5 shrink-0 sm:block text-primary-600"
              >
                <path
                  d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM9 12H7V7H9V12ZM8 6C7.4 6 7 5.6 7 5C7 4.4 7.4 4 8 4C8.6 4 9 4.4 9 5C9 5.6 8.6 6 8 6Z"
                  fill="currentColor"
                ></path>
              </svg>
              <div>
                <div className="font-semibold mb-2 text-primary-900">
                  Why are we asking this?
                </div>
                <p className="leading-relaxed">
                  This information helps us match you with the most relevant
                  mentors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
