import { useState } from "react";
import UniversitySelector from "./UniversitySelector";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { MatchingService } from "../services/matchingService";

interface FormData {
  // Academic & Medical Interests (Weight: 7, 9, 6)
  academicLevel: string; // Weight: 7
  primarySpecialtyInterest: string; // Weight: 9
  degreeTrackPreference: string; // Weight: 6

  // Help Needed & Application Status (Weight: 9, 7, 7)
  helpAreas: string[]; // Weight: 9 (up to 3)
  mcatStatus: string; // Weight: 7
  applicationTarget: string; // Weight: 7

  // Mentorship Preferences (Weight: 7, 7, 6, 5, 5)
  preferredMentorshipStyle: string; // Weight: 7
  communicationFrequency: string; // Weight: 7
  communicationModes: string[]; // Weight: 6 (multi-select)
  inPersonPreference: boolean | null; // Weight: 5
  geographicPreference: string; // Weight: 5 (if in_person = true)
  cityState: string; // If in_person = true

  // Background & Preferences (Weight: 7, 2, 2)
  applicantBackground: string[]; // Weight: 7 (multi-select)
  preferMentorSameGender: boolean | null; // Weight: 2
  preferredGender: string; // Weight: 2 (if toggle ON)
  preferAlumniMentor: boolean | null; // Weight: 2
  preferredUniversity: string; // Weight: 2 (if toggle ON)
}

interface QuestionnaireProps {
  onBackToSignUp?: () => void;
}

const Questionnaire = ({
  onBackToSignUp: _onBackToSignUp,
}: QuestionnaireProps) => {
  const { user, loading } = useAuth();

  // Debug logging
  console.log("Auth state - user:", user, "loading:", loading);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Academic & Medical Interests
    academicLevel: "",
    primarySpecialtyInterest: "",
    degreeTrackPreference: "",

    // Help Needed & Application Status
    helpAreas: [],
    mcatStatus: "",
    applicationTarget: "",

    // Mentorship Preferences
    preferredMentorshipStyle: "",
    communicationFrequency: "",
    communicationModes: [],
    inPersonPreference: null,
    geographicPreference: "",
    cityState: "",

    // Background & Preferences
    applicantBackground: [],
    preferMentorSameGender: null,
    preferredGender: "",
    preferAlumniMentor: null,
    preferredUniversity: "",
  });

  const totalSteps = 5;

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

  const handleSubmit = async () => {
    // Use the auth context user instead of manual session checks
    if (loading) {
      console.log("Auth still loading, please wait...");
      return;
    }

    if (!user) {
      console.error("No authenticated user found");
      alert("Please sign up first to use the questionnaire.");
      window.location.href = "/";
      return;
    }

    console.log("Using authenticated user:", user);

    setIsLoading(true);

    try {
      // Save mentee data to Supabase
      const { data, error } = await supabase.from("mentees").insert([
        {
          id: user.id,
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          academic_level: formData.academicLevel,
          primary_specialty_interest: formData.primarySpecialtyInterest,
          degree_track_preference: formData.degreeTrackPreference,
          help_areas: formData.helpAreas,
          mcat_status: formData.mcatStatus,
          application_target: formData.applicationTarget,
          preferred_mentorship_style: formData.preferredMentorshipStyle,
          communication_frequency: formData.communicationFrequency,
          communication_modes: formData.communicationModes,
          in_person_preference: formData.inPersonPreference ?? false,
          geographic_preference: formData.geographicPreference || null,
          city_state: formData.cityState || null,
          applicant_background: formData.applicantBackground,
          prefer_mentor_same_gender: formData.preferMentorSameGender ?? false,
          preferred_gender: formData.preferredGender || null,
          prefer_alumni_mentor: formData.preferAlumniMentor ?? false,
          preferred_university: formData.preferredUniversity || null,
        },
      ]);

      if (error) {
        console.error("Error saving mentee data:", error);
        alert("Error saving your information. Please try again.");
        return;
      }

      console.log("Mentee data saved successfully:", data);

      // Run matching algorithm
      console.log("Finding mentor matches...");
      const menteeProfileData = {
        id: user.id,
        ...formData,
        // Convert form data to match the expected structure
        primary_specialty_interest: formData.primarySpecialtyInterest,
        help_areas: formData.helpAreas,
        application_target: formData.applicationTarget,
        preferred_mentorship_style: formData.preferredMentorshipStyle,
        communication_frequency: formData.communicationFrequency,
        communication_modes: formData.communicationModes,
        in_person_preference: formData.inPersonPreference ?? false,
        geographic_preference: formData.geographicPreference,
        city_state: formData.cityState,
        applicant_background: formData.applicantBackground,
        prefer_mentor_same_gender: formData.preferMentorSameGender ?? false,
        preferred_gender: formData.preferredGender,
        prefer_alumni_mentor: formData.preferAlumniMentor ?? false,
        preferred_university: formData.preferredUniversity,
        degree_track_preference: formData.degreeTrackPreference,
      };

      console.log("Mentee data for matching:", menteeProfileData);
      const matches = await MatchingService.findMatches(menteeProfileData);

      console.log(`Found ${matches.length} matches:`, matches);

      if (matches.length > 0) {
        // Save matches to database
        await MatchingService.saveMatches(user.id, matches);

        // Show detailed match results
        const matchDetails = matches
          .map(
            (match, index) =>
              `${index + 1}. ${match.mentor?.first_name || "Unknown"} ${
                match.mentor?.last_name || ""
              } - ${match.score}% match (${
                match.mentor?.medical_specialty || "Unknown specialty"
              })`
          )
          .join("\n");

        alert(
          `🎉 SUCCESS! Found ${matches.length} mentor matches:\n\n${matchDetails}\n\nCheck the console for detailed matching factors.`
        );

        console.log("=== DETAILED MATCH RESULTS ===");
        matches.forEach((match, index) => {
          console.log(
            `${index + 1}. ${match.mentor?.first_name} ${
              match.mentor?.last_name
            }`
          );
          console.log(`   Score: ${match.score}%`);
          console.log(`   Specialty: ${match.mentor?.medical_specialty}`);
          console.log(`   Factors:`, match.factors);
          console.log("---");
        });
      } else {
        alert(
          "Your profile has been created! We're working on finding the best mentor matches for you."
        );
      }

      // TODO: Redirect to matches page or dashboard
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.academicLevel !== "" &&
          formData.primarySpecialtyInterest !== "" &&
          formData.degreeTrackPreference !== ""
        );
      case 2:
        return (
          formData.helpAreas.length > 0 &&
          formData.helpAreas.length <= 3 &&
          formData.mcatStatus !== "" &&
          formData.applicationTarget !== ""
        );
      case 3:
        return (
          formData.preferredMentorshipStyle !== "" &&
          formData.communicationFrequency !== "" &&
          formData.communicationModes.length > 0
        );
      case 4:
        return formData.applicantBackground.length > 0;
      case 5:
        // In-person and preference validation
        if (
          formData.inPersonPreference &&
          formData.geographicPreference === ""
        ) {
          return false;
        }
        return true;
      case 6:
        // Final review - all required fields should be filled
        return true;
      default:
        return true;
    }
  };

  const academicLevelOptions = [
    { value: "freshman", label: "Freshman (1st Year)" },
    { value: "sophomore", label: "Sophomore (2nd Year)" },
    { value: "junior", label: "Junior (3rd Year)" },
    { value: "senior", label: "Senior (4th Year)" },
    { value: "recent-graduate", label: "Recent Graduate" },
    { value: "masters-student", label: "Master's Student" },
    { value: "other", label: "Other" },
  ];

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

  const degreeTrackOptions = [
    { value: "md", label: "MD schools only" },
    { value: "do", label: "DO schools only" },
    { value: "both", label: "Both MD and DO" },
  ];

  const helpAreaOptions = [
    { value: "mcat-preparation", label: "MCAT Preparation" },
    { value: "personal-statements", label: "Personal Statements" },
    { value: "letters-of-recommendation", label: "Letters of Recommendation" },
    { value: "interview-skills", label: "Interview Skills" },
    { value: "building-school-list", label: "Building School List" },
    {
      value: "general-application-strategy",
      label: "General Application Strategy",
    },
    { value: "specialty-insight", label: "Specialty Insight" },
    {
      value: "networking-professional-connections",
      label: "Networking/Professional Connections",
    },
    {
      value: "emotional-support-motivation",
      label: "Emotional Support & Motivation",
    },
    { value: "research-mentorship", label: "Research Mentorship" },
    { value: "coursework-exams", label: "Coursework/Exams" },
    { value: "gap-year-planning", label: "Gap Year Planning" },
  ];

  const mcatStatusOptions = [
    { value: "have-not-started-studying", label: "Have not started studying" },
    { value: "started-studying", label: "Started studying" },
    {
      value: "taken-exam-awaiting-scores",
      label: "Taken exam (awaiting scores)",
    },
    { value: "have-received-my-scores", label: "Have received my scores" },
  ];

  const applicationTargetOptions = [
    { value: "next-6-months", label: "Next 6 months (this cycle)" },
    { value: "in-1-2-years", label: "In 1-2 years (next cycle)" },
    { value: "in-3-plus-years", label: "In 3+ years" },
    { value: "not-sure", label: "Not sure" },
  ];

  const applicantBackgroundOptions = [
    { value: "traditional", label: "Traditional" },
    { value: "non-traditional", label: "Non-traditional" },
    { value: "first-gen", label: "First-generation college student" },
    { value: "urm", label: "Underrepresented in Medicine (URiM)" },
  ];

  const mentorshipStyleOptions = [
    { value: "structured", label: "Structured" },
    { value: "flexible", label: "Flexible" },
    { value: "mix", label: "Mix of both" },
  ];

  const communicationFrequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "bi-weekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "as-needed", label: "As needed" },
  ];

  const communicationModeOptions = [
    { value: "email", label: "Email" },
    { value: "video-calls", label: "Video Calls" },
    { value: "phone-calls", label: "Phone Calls" },
    { value: "text-chat", label: "Text/Chat" },
    { value: "in-person", label: "In-person" },
  ];

  const geographicPreferenceOptions = [
    { value: "same-city", label: "Same city" },
    { value: "same-state-region", label: "Same state/region" },
    { value: "any-location", label: "Any location" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-Binary" },
    { value: "no-preference", label: "No preference" },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Academic & Medical Interests
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your current academic level?
                </div>
                <div className="flex flex-wrap items-center">
                  {academicLevelOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.academicLevel === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("academicLevel", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your primary medical specialty of interest?
                </div>
                <div className="flex flex-wrap items-center">
                  {medicalSpecialtyOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.primarySpecialtyInterest === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("primarySpecialtyInterest", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your degree track preference?
                </div>
                <div className="flex flex-wrap items-center">
                  {degreeTrackOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.degreeTrackPreference === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("degreeTrackPreference", option.value)
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
              What do you want help with?
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Select up to 3 areas where you'd like mentorship (Weight: 9)
                </div>
                <div className="mb-4 text-xs text-gray-500">
                  Selected: {formData.helpAreas.length}/3
                </div>
                <div className="flex flex-wrap items-center">
                  {helpAreaOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.helpAreas.includes(option.value)
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() => {
                        const currentAreas = formData.helpAreas;
                        const isSelected = currentAreas.includes(option.value);

                        if (isSelected) {
                          updateFormData(
                            "helpAreas",
                            currentAreas.filter((area) => area !== option.value)
                          );
                        } else if (currentAreas.length < 3) {
                          updateFormData("helpAreas", [
                            ...currentAreas,
                            option.value,
                          ]);
                        }
                      }}
                      disabled={
                        !formData.helpAreas.includes(option.value) &&
                        formData.helpAreas.length >= 3
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What is your current MCAT status?
                </div>
                <div className="flex flex-wrap items-center">
                  {mcatStatusOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.mcatStatus === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() => updateFormData("mcatStatus", option.value)}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  When are you planning to apply to medical school?
                </div>
                <div className="flex flex-wrap items-center">
                  {applicationTargetOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.applicationTarget === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("applicationTarget", option.value)
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
              Mentorship Preferences
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What mentorship style do you prefer?
                </div>
                <div className="flex flex-wrap items-center">
                  {mentorshipStyleOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.preferredMentorshipStyle === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("preferredMentorshipStyle", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  How often would you like to communicate with your mentor?
                </div>
                <div className="flex flex-wrap items-center">
                  {communicationFrequencyOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.communicationFrequency === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() =>
                        updateFormData("communicationFrequency", option.value)
                      }
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What communication modes work for you? (Select all that apply)
                </div>
                <div className="flex flex-wrap items-center">
                  {communicationModeOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.communicationModes.includes(option.value)
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() => {
                        const currentModes = formData.communicationModes;
                        const isSelected = currentModes.includes(option.value);

                        if (isSelected) {
                          updateFormData(
                            "communicationModes",
                            currentModes.filter((mode) => mode !== option.value)
                          );
                        } else {
                          updateFormData("communicationModes", [
                            ...currentModes,
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
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Your Background
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  What type of applicant background describes you? (Select all
                  that apply)
                </div>
                <div className="flex flex-wrap items-center">
                  {applicantBackgroundOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.applicantBackground.includes(option.value)
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() => {
                        const currentBackground = formData.applicantBackground;
                        const isSelected = currentBackground.includes(
                          option.value
                        );

                        if (isSelected) {
                          updateFormData(
                            "applicantBackground",
                            currentBackground.filter(
                              (bg) => bg !== option.value
                            )
                          );
                        } else {
                          updateFormData("applicantBackground", [
                            ...currentBackground,
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
            </div>
          </>
        );

      case 5:
        return (
          <>
            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              Location & Preferences
            </h1>
            <div className="space-y-6">
              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Are you interested in meeting your mentor in person?
                </div>
                <div className="flex flex-wrap items-center">
                  <button
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.inPersonPreference === true
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() => updateFormData("inPersonPreference", true)}
                  >
                    <span className="font-medium">Yes</span>
                  </button>
                  <button
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.inPersonPreference === false
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() => updateFormData("inPersonPreference", false)}
                  >
                    <span className="font-medium">No</span>
                  </button>
                </div>
              </div>

              {formData.inPersonPreference && (
                <>
                  <div className="mt-6">
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      What is your city and state? (Optional)
                    </div>
                    <input
                      type="text"
                      value={formData.cityState}
                      onChange={(e) =>
                        updateFormData("cityState", e.target.value)
                      }
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 bg-white"
                      placeholder="e.g., Boston, MA"
                    />
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      How open are you to mentors in different locations?
                    </div>
                    <div className="flex flex-wrap items-center">
                      {geographicPreferenceOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                            formData.geographicPreference === option.value
                              ? "bg-white border-primary-500 text-gray-800"
                              : "bg-white border-gray-300 text-gray-800"
                          }`}
                          onClick={() =>
                            updateFormData("geographicPreference", option.value)
                          }
                        >
                          <span className="font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Do you have a gender preference for your mentor?
                </div>
                <div className="flex flex-wrap items-center">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                        formData.preferredGender === option.value
                          ? "bg-white border-primary-500 text-gray-800"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      onClick={() => {
                        updateFormData("preferredGender", option.value);
                        // Set the boolean based on whether they chose "no preference"
                        updateFormData(
                          "preferMentorSameGender",
                          option.value !== "no-preference"
                        );
                      }}
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Would you prefer a mentor from your university/alma mater?
                </div>
                <div className="flex flex-wrap items-center mb-4">
                  <button
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.preferAlumniMentor === true
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() => updateFormData("preferAlumniMentor", true)}
                  >
                    <span className="font-medium">Yes</span>
                  </button>
                  <button
                    className={`m-1 flex h-full cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2 shadow-sm focus:outline-none ${
                      formData.preferAlumniMentor === false
                        ? "bg-white border-primary-500 text-gray-800"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                    onClick={() => {
                      updateFormData("preferAlumniMentor", false);
                      updateFormData("preferredUniversity", "");
                    }}
                  >
                    <span className="font-medium">No preference</span>
                  </button>
                </div>

                {formData.preferAlumniMentor && (
                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Which university?
                    </div>
                    <UniversitySelector
                      value={formData.preferredUniversity}
                      onChange={(value) =>
                        updateFormData("preferredUniversity", value)
                      }
                      placeholder="Search for your university..."
                    />
                  </div>
                )}
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
                className="px-6 py-3 text-base rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 focus:outline-none  bg-white/80 backdrop-blur-sm"
              >
                Previous
              </button>
            )}

            <div className="flex-1"></div>

            <button
              disabled={!isStepValid() || isLoading || loading}
              onClick={currentStep === totalSteps ? handleSubmit : handleNext}
              className={`px-12 py-3 text-base rounded-lg font-medium focus:outline-none ${
                isStepValid() && !isLoading && !loading
                  ? "bg-primary-500 text-white hover:bg-primary-600 "
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading
                ? "Loading..."
                : currentStep === totalSteps
                ? "Complete"
                : "Next"}
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
