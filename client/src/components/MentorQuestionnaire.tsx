import { useState } from "react";

interface MentorFormData {
  // Medical Background
  primarySpecialty: string;
  careerStage: string;
  educationType: string; // MD, DO, MD/PhD, current medical student

  // Research & Experience
  researchField: string; // For physician scientists
  researchExperience: string; // Highest level

  // Medical School Experience
  applicantTypeExperience: string; // Traditional, Non-traditional, First-gen, URM

  // Mentorship Approach
  mentorshipStyle: string; // Structured, Flexible, Mix of both
  comfortableTopics: string[]; // Multiple selections

  // Communication & Availability
  communicationMode: string;
  meetingFrequency: string;
  geographicalOpenness: string;

  // Identity & Matching
  genderIdentity: string;
  similarIdentityImportance: string;
}

interface MentorQuestionnaireProps {
  onBackToSignUp?: () => void;
}

const MentorQuestionnaire = ({
  onBackToSignUp: _onBackToSignUp,
}: MentorQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MentorFormData>({
    // Medical Background
    primarySpecialty: "",
    careerStage: "",
    educationType: "",

    // Research & Experience
    researchField: "",
    researchExperience: "",

    // Medical School Experience
    applicantTypeExperience: "",

    // Mentorship Approach
    mentorshipStyle: "",
    comfortableTopics: [],

    // Communication & Availability
    communicationMode: "",
    meetingFrequency: "",
    geographicalOpenness: "",

    // Identity & Matching
    genderIdentity: "",
    similarIdentityImportance: "",
  });

  const totalSteps = 6;

  const updateFormData = (field: keyof MentorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps && !isLoading) {
      setIsLoading(true);
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
        return formData.primarySpecialty !== "" && formData.careerStage !== "";
      case 2:
        return (
          formData.educationType !== "" &&
          formData.applicantTypeExperience !== ""
        );
      case 3:
        return formData.mentorshipStyle !== "" && formData.researchField !== "";
      case 4:
        return formData.comfortableTopics.length > 0;
      case 5:
        return (
          formData.communicationMode !== "" && formData.meetingFrequency !== ""
        );
      case 6:
        return (
          formData.genderIdentity !== "" &&
          formData.similarIdentityImportance !== ""
        );
      default:
        return true;
    }
  };

  // Medical Specialties (same as mentee)
  const medicalSpecialtyOptions = [
    { value: "internal-medicine", label: "Internal Medicine" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "surgery", label: "Surgery" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "emergency-medicine", label: "Emergency Medicine" },
    { value: "family-medicine", label: "Family Medicine" },
    { value: "radiology", label: "Radiology" },
    { value: "anesthesiology", label: "Anesthesiology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "neurology", label: "Neurology" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "cardiology", label: "Cardiology" },
    { value: "other", label: "Other/Undecided" },
  ];

  const careerStageOptions = [
    { value: "medical-student-m1-m2", label: "Medical Student (M1/M2)" },
    { value: "medical-student-m3-m4", label: "Medical Student (M3/M4)" },
    { value: "resident-fellow", label: "Resident/Fellow" },
    { value: "attending-physician", label: "Attending Physician" },
    { value: "physician-scientist", label: "Physician Scientist" },
  ];

  const educationTypeOptions = [
    { value: "md", label: "MD" },
    { value: "do", label: "DO" },
    { value: "md-phd", label: "MD/PhD" },
    { value: "current-medical-student", label: "Current Medical Student" },
  ];

  const researchFieldOptions = [
    { value: "none", label: "None" },
    { value: "basic-science", label: "Basic Science" },
    { value: "clinical-science", label: "Clinical Science" },
    { value: "translational-medicine", label: "Translational Medicine" },
    {
      value: "public-health-epidemiology",
      label: "Public Health/Epidemiology",
    },
    { value: "health-policy", label: "Health Policy" },
    { value: "other", label: "Other" },
  ];

  const applicantTypeExperienceOptions = [
    { value: "traditional", label: "Traditional Applicant" },
    { value: "non-traditional", label: "Non-traditional Applicant" },
    { value: "first-gen", label: "First-generation college student applicant" },
    { value: "urm", label: "Applicant from underrepresented background" },
  ];

  const mentorshipStyleOptions = [
    {
      value: "structured",
      label: "Structured - scheduled topics and clear agenda",
    },
    {
      value: "flexible",
      label: "Flexible - open ended discussions and mentee led",
    },
    { value: "mix", label: "Mix of both" },
  ];

  const comfortableTopicsOptions = [
    { value: "mcat-preparation", label: "MCAT Preparation" },
    { value: "personal-essays", label: "Personal Essays" },
    { value: "interview-skills", label: "Interview Skills" },
    { value: "medical-coursework-exams", label: "Medical Coursework/Exams" },
    { value: "research-opportunities", label: "Research Opportunities" },
    { value: "work-life-balance", label: "Work-Life Balance" },
    {
      value: "navigating-medical-school-residency",
      label: "Navigating Medical School/Residency",
    },
  ];

  const communicationModeOptions = [
    { value: "email", label: "Email" },
    { value: "video-calls", label: "Video calls" },
    { value: "phone-calls", label: "Phone calls" },
    { value: "text-messages", label: "Text messages" },
    { value: "in-person", label: "In person meeting" },
  ];

  const meetingFrequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "bi-monthly", label: "Bi-monthly" },
    { value: "monthly", label: "Monthly" },
    { value: "as-needed", label: "As needed" },
  ];

  const geographicalOpennessOptions = [
    { value: "any-location", label: "Yes, any location is fine" },
    {
      value: "same-state-region",
      label: "I would prefer someone in my state or region",
    },
    { value: "same-city", label: "I would prefer someone in the same city" },
  ];

  const researchExperienceOptions = [
    {
      value: "undergraduate-research-assistant",
      label: "Undergraduate research assistant",
    },
    { value: "presented-at-conference", label: "Presented at a conference" },
    { value: "published-co-author", label: "Published a paper as a co-author" },
    {
      value: "published-first-author",
      label: "Published a paper as a first author",
    },
    {
      value: "principal-investigator",
      label: "Principal investigator on a grant",
    },
    { value: "none", label: "None of the above" },
    { value: "other", label: "Other" },
  ];

  const similarIdentityImportanceOptions = [
    { value: "important", label: "Yes, this is important to me" },
    {
      value: "nice-bonus",
      label: "It would be a nice bonus, but not essential",
    },
    { value: "does-not-matter", label: "No, it does not matter to me" },
  ];

  const genderIdentityOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-Binary" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Medical Background
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your medical specialty or specialty of interest?
                </div>
                <div className="flex flex-wrap items-center">
                  {medicalSpecialtyOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.primarySpecialty === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("primarySpecialty", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your current career stage?
                </div>
                <div className="flex flex-wrap items-center">
                  {careerStageOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.careerStage === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("careerStage", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Education & Experience
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Are you an MD, DO, MD/PhD, or current medical student?
                </div>
                <div className="flex flex-wrap items-center">
                  {educationTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.educationType === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("educationType", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What type of applicant would you consider yourself to have
                  been?
                </div>
                <div className="flex flex-wrap items-center">
                  {applicantTypeExperienceOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.applicantTypeExperience === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("applicantTypeExperience", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Mentorship Approach
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your preferred mentorship style?
                </div>
                <div className="flex flex-wrap items-center">
                  {mentorshipStyleOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.mentorshipStyle === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("mentorshipStyle", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your research field? (For physician scientists)
                </div>
                <div className="flex flex-wrap items-center">
                  {researchFieldOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.researchField === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("researchField", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your highest level of research experience?
                </div>
                <div className="flex flex-wrap items-center">
                  {researchExperienceOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.researchExperience === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("researchExperience", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Areas of Expertise
            </h1>
            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Which topics are you most comfortable giving advice in? (Select
                all that apply)
              </div>
              <div className="mb-4 text-xs text-gray-500">
                Selected: {formData.comfortableTopics.length}
              </div>
              <div className="flex flex-wrap items-center">
                {comfortableTopicsOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.comfortableTopics.includes(option.value)
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() => {
                      const currentTopics = formData.comfortableTopics;
                      const isSelected = currentTopics.includes(option.value);

                      if (isSelected) {
                        updateFormData(
                          "comfortableTopics",
                          currentTopics.filter(
                            (topic) => topic !== option.value
                          )
                        );
                      } else {
                        updateFormData("comfortableTopics", [
                          ...currentTopics,
                          option.value,
                        ]);
                      }
                    }}
                  >
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Communication & Availability
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your preferred mode of communication?
                </div>
                <div className="flex flex-wrap items-center">
                  {communicationModeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.communicationMode === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("communicationMode", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  How frequently can you connect with a mentee?
                </div>
                <div className="flex flex-wrap items-center">
                  {meetingFrequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.meetingFrequency === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("meetingFrequency", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Are you open to mentoring a student from a different
                  geographical location?
                </div>
                <div className="flex flex-wrap items-center">
                  {geographicalOpennessOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.geographicalOpenness === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("geographicalOpenness", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 6:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Personal Information
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your gender identity?
                </div>
                <div className="flex flex-wrap items-center">
                  {genderIdentityOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.genderIdentity === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("genderIdentity", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Are you open to mentoring a student who shares a similar
                  identity to you?
                </div>
                <div className="flex flex-wrap items-center">
                  {similarIdentityImportanceOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.similarIdentityImportance === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData(
                          "similarIdentityImportance",
                          option.value
                        )
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
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
      <div className="absolute -top-48 -left-[10%] md:left-[15%] w-[500px] h-96 bg-gradient-to-br from-primary-200/40 via-primary-300/30 to-primary-100/20 rounded-full blur-2xl opacity-60"></div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-primary-100/50 bg-white/80 backdrop-blur-sm w-full">
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
      <div className="relative z-10 pt-32 pb-12 w-full">
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
                className="px-6 py-3 text-base rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 focus:outline-none bg-white/80 backdrop-blur-sm"
              >
                Previous
              </button>
            )}

            <div className="flex-1"></div>

            <button
              disabled={!isStepValid() || isLoading}
              onClick={
                currentStep === totalSteps
                  ? () => console.log("Mentor form submitted:", formData)
                  : handleNext
              }
              className={`px-12 py-3 text-base rounded-lg font-medium focus:outline-none ${
                isStepValid() && !isLoading
                  ? "bg-primary-500 text-white hover:bg-primary-600"
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
                  This information helps us match you with mentees who would
                  benefit most from your experience and expertise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorQuestionnaire;
