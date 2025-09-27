import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  MapPin,
  MessageSquare,
  Bookmark,
} from "lucide-react";

// Mock data for now - will be replaced with real Supabase data
const mockMentees = [
  {
    id: "1",
    firstName: "Emily",
    lastName: "Dalton",
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    currentRole: "Pre-med Student at Stanford",
    location: "Stanford, California",
    primaryInterest: "Cardiology",
    gpa: "3.9",
    mcatScore: "518",
    helpAreas: [
      "Research opportunities",
      "Application timeline",
      "Interview prep",
    ],
    applicationTarget: "Fall 2024",
    personalStatement:
      "Passionate about cardiovascular health and seeking guidance on research opportunities...",
    connections: 2,
    followers: 150,
    openToMentorship: true,
    matchReasons: [
      "Shared specialty interest",
      "Strong academic performance",
      "Research experience alignment",
    ],
  },
  {
    id: "2",
    firstName: "Channing",
    lastName: "Curry",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    currentRole: "Senior Pre-med at UCLA",
    location: "Los Angeles, California",
    primaryInterest: "Emergency Medicine",
    gpa: "3.7",
    mcatScore: "512",
    helpAreas: ["Clinical experience", "Specialty exploration", "MCAT prep"],
    applicationTarget: "Fall 2025",
    personalStatement:
      "Interested in emergency medicine and looking for mentorship on clinical experience...",
    connections: 5,
    followers: 89,
    openToMentorship: true,
    matchReasons: [
      "Compatible timeline",
      "Communication preferences match",
      "Similar background",
    ],
  },
  {
    id: "3",
    firstName: "Aubrey",
    lastName: "Macky",
    profileImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    currentRole: "Post-bacc Student at University of Chicago",
    location: "Chicago, Illinois",
    primaryInterest: "Pediatrics",
    gpa: "3.8",
    mcatScore: "515",
    helpAreas: [
      "Non-traditional path",
      "Post-bacc guidance",
      "Pediatric shadowing",
    ],
    applicationTarget: "Fall 2024",
    personalStatement:
      "Career changer pursuing pediatrics, seeking guidance on non-traditional pathway...",
    connections: 3,
    followers: 67,
    openToMentorship: true,
    matchReasons: [
      "Non-traditional background",
      "Pediatric interest",
      "Geographic proximity",
    ],
  },
];

export default function MentorFeed() {
  const [selectedMentee, setSelectedMentee] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <nav className="flex items-center space-x-8 text-sm">
              <span className="text-primary-600 border-b-2 border-primary-600 font-medium">
                FEED
              </span>
              <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                MATCHES
              </span>
              <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                MESSAGES
              </span>
              <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                REPORTS
              </span>
              <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                MORE
              </span>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
              alt="Your profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Start a new search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="text-sm text-primary-600 space-x-2">
            <span className="hover:underline cursor-pointer">Advanced</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">
              Saved / History
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Showing results for</h3>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Specialty Filter */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Medical Specialty
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="bg-primary-100 text-primary-800 px-2 py-1 text-sm rounded border border-primary-500">
                  Cardiology
                  <button className="ml-2 text-primary-600">×</button>
                </div>
              </div>
              <button className="text-primary-600 text-sm hover:underline">
                + Add specialty
              </button>
            </div>
          </div>

          {/* Locations */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Locations
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="bg-primary-100 text-primary-800 px-2 py-1 text-sm rounded border border-primary-500">
                  Greater Bay Area
                  <button className="ml-2 text-primary-600">×</button>
                </div>
              </div>
              <div className="text-primary-600 text-sm cursor-pointer hover:underline">
                San Francisco Bay Area, Greater New York...
              </div>
            </div>
          </div>

          {/* Academic Level */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Academic Level
            </h4>
            <div className="space-y-1">
              <div className="text-primary-600 text-sm cursor-pointer hover:underline">
                Pre-med (156)
              </div>
              <div className="text-primary-600 text-sm cursor-pointer hover:underline">
                Post-bacc (89)
              </div>
              <div className="text-primary-600 text-sm cursor-pointer hover:underline">
                Gap year (67)
              </div>
            </div>
          </div>

          {/* Help Areas */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Help Areas
            </h4>
            <input
              type="text"
              placeholder="Enter a help area..."
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Universities */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Universities
            </h4>
            <div className="text-primary-600 text-sm cursor-pointer hover:underline mb-2">
              Stanford University
            </div>
            <button className="text-primary-600 text-sm hover:underline">
              + Add universities or boolean
            </button>
          </div>

          {/* Application Timeline */}
          <div className="mb-6">
            <h4 className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Application Timeline
            </h4>
            <div className="text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Next 6 months
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {/* Results Header */}
          <div className="flex border-b border-gray-200">
            <button className="flex-1 text-center hover:bg-gray-50 py-4 border-r border-gray-200 bg-white">
              <div className="text-2xl font-bold text-gray-900">83</div>
              <div className="text-sm text-gray-600">available mentees</div>
            </button>
            <button className="flex-1 text-center hover:bg-gray-50 py-4 border-r border-gray-200 bg-white border-b-4 border-b-primary-600">
              <div className="text-2xl font-bold text-primary-600">12</div>
              <div className="text-sm text-primary-600">your matches</div>
            </button>
            <button className="flex-1 text-center hover:bg-gray-50 py-4 border-r border-gray-200 bg-white">
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">new this week</div>
            </button>
            <button className="flex-1 text-center hover:bg-gray-50 py-4 bg-white">
              <div className="text-2xl font-bold text-gray-900">5</div>
              <div className="text-sm text-gray-600">saved mentees</div>
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 px-6 py-3">
            <span>83 results • Sorted by relevance</span>
            <span>1 - 25</span>
          </div>

          {/* Mentee Cards */}
          <div className="space-y-0">
            {mockMentees.map((mentee) => (
              <div
                key={mentee.id}
                className="bg-white border-t border-gray-200 p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex">
                  {/* Profile Image */}
                  <div className="flex-shrink-0 mr-4">
                    <button
                      onClick={() => setSelectedMentee(mentee.id)}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={mentee.profileImage}
                        alt={`${mentee.firstName} ${mentee.lastName}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </button>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <button
                          onClick={() => setSelectedMentee(mentee.id)}
                          className="text-left hover:text-primary-600 transition-colors"
                        >
                          <h3 className="text-lg font-medium text-gray-900">
                            {mentee.firstName} {mentee.lastName}
                            <span className="ml-2 text-sm text-gray-500">
                              2nd
                            </span>
                          </h3>
                        </button>
                        <p className="text-gray-600 text-sm mb-1">
                          {mentee.currentRole}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {mentee.location}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:bg-primary-50 p-2 rounded">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:bg-gray-50 p-2 rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                      <span>GPA: {mentee.gpa}</span>
                      <span>MCAT: {mentee.mcatScore}</span>
                      <span>Interest: {mentee.primaryInterest}</span>
                    </div>

                    {/* Help Areas */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">
                        Seeking help with:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {mentee.helpAreas.slice(0, 3).map((area) => (
                          <span
                            key={area}
                            className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs border border-primary-500"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{mentee.connections} Mentor connections</span>
                        <span>{mentee.followers} Following mentors</span>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          className="bg-primary-600 text-white px-6 py-2 text-sm font-medium rounded hover:bg-primary-700 transition-colors"
                          onClick={() => setSelectedMentee(mentee.id)}
                        >
                          Accept
                        </button>
                        <button className="border border-primary-600 text-primary-600 px-6 py-2 text-sm font-medium rounded hover:bg-primary-50 transition-colors">
                          Pass
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center px-6 pb-6">
            <nav className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50 rounded">
                Previous
              </button>
              <button className="w-10 h-10 bg-primary-600 text-white text-sm rounded flex items-center justify-center">
                1
              </button>
              <button className="w-10 h-10 border border-gray-300 text-sm hover:bg-gray-50 rounded flex items-center justify-center">
                2
              </button>
              <button className="w-10 h-10 border border-gray-300 text-sm hover:bg-gray-50 rounded flex items-center justify-center">
                3
              </button>
              <button className="px-4 py-2 border border-gray-300 text-sm hover:bg-gray-50 rounded">
                Next
              </button>
            </nav>
          </div>
        </div>

        {/* Right Panel - Selected Mentee Details */}
        {selectedMentee && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Mentee Details</h3>
              <button
                onClick={() => setSelectedMentee(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {(() => {
              const mentee = mockMentees.find((m) => m.id === selectedMentee);
              if (!mentee) return null;

              return (
                <div>
                  <div className="text-center mb-4">
                    <img
                      src={mentee.profileImage}
                      alt={`${mentee.firstName} ${mentee.lastName}`}
                      className="w-20 h-20 rounded-full mx-auto mb-2"
                    />
                    <h4 className="font-medium">
                      {mentee.firstName} {mentee.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {mentee.currentRole}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Academic Level:</span>
                      <span className="ml-2">Senior Undergraduate</span>
                    </div>
                    <div>
                      <span className="font-medium">Application Target:</span>
                      <span className="ml-2">{mentee.applicationTarget}</span>
                    </div>
                    <div>
                      <span className="font-medium">Timeline:</span>
                      <span className="ml-2">Applying soon</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Personal Statement:</h5>
                    <p className="text-sm text-gray-600">
                      "{mentee.personalStatement}"
                    </p>
                  </div>

                  <div className="mt-6 space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700">
                      Accept as Mentee
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 hover:bg-gray-50">
                      Send Message First
                    </button>
                    <button className="w-full text-red-600 py-2 hover:bg-red-50">
                      Pass on This Mentee
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
