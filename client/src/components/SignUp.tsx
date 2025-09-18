import { useState } from "react";
import medicalImage from "../assets/ishutter-stock-image-test.jpg";

interface SignUpProps {
  onSignUpComplete?: () => void;
}

const SignUp = ({ onSignUpComplete }: SignUpProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);

    // Call the completion callback
    onSignUpComplete?.();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white">
        <div className="w-full max-w-md mx-auto px-8 py-20">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Create account
            </h2>
            <p className="text-gray-500">
              Connect with mentors who've walked your path
            </p>
          </div>

          {/* Google Sign Up Button */}
          <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 mb-6">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className={`w-full px-3 py-3 border rounded-md focus:outline-none bg-white transition-all duration-200 ${
                    errors.firstName
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-400"
                  }`}
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className={`w-full px-3 py-3 border rounded-md focus:outline-none bg-white transition-all duration-200 ${
                    errors.lastName
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-gray-400"
                  }`}
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className={`w-full px-3 py-3 border rounded-md focus:outline-none bg-white transition-all duration-200 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-400"
                }`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                className={`w-full px-3 py-3 border rounded-md focus:outline-none bg-white transition-all duration-200 ${
                  errors.password
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-400"
                }`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeat password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  updateFormData("confirmPassword", e.target.value)
                }
                className={`w-full px-3 py-3 border rounded-md focus:outline-none bg-white transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-gray-400"
                }`}
                placeholder="Repeat password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-md font-medium text-white transition-all duration-200 mt-6 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-500 hover:bg-primary-600 focus:outline-none"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  Creating Account...
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                </div>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Image/Content Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={medicalImage}
            alt="Medical professionals"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Background overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Begin your medical journey.
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Sign up for free and enjoy access to all features for 30 days. No
              credit card required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
