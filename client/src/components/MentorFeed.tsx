import { useState, useEffect, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  MapPin,
  MessageSquare,
  Bookmark,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../lib/supabase";
import type { MenteeProfile } from "../lib/supabase";
import { universities } from "../data/universities";

// Message and conversation types
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface MessagesData {
  [conversationId: string]: Message[];
}

// Profile picture generator function
const getProfilePicture = (firstName: string, lastName: string, id: string) => {
  // Use a combination of services for variety
  const seed = Math.abs(id.split("").reduce((a, b) => a + b.charCodeAt(0), 0));
  const services = [
    `https://i.pravatar.cc/150?img=${(seed % 50) + 1}`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}-${lastName}&size=150`,
    `https://robohash.org/${id}.png?size=150x150&set=set1`,
  ];
  return services[seed % services.length];
};

// Helper function to format specialty names
const formatSpecialty = (specialty: string) => {
  return specialty
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to format help areas
const formatHelpArea = (helpArea: string) => {
  return helpArea
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to format academic level
const formatAcademicLevel = (level: string) => {
  const levelMap: { [key: string]: string } = {
    freshman: "1st year",
    sophomore: "2nd year",
    junior: "3rd year",
    senior: "4th year",
    "post-bacc": "Post-baccalaureate",
    "gap-year": "Gap year",
  };
  return levelMap[level] || level;
};

// Helper function to format locations
const formatLocation = (location: string) => {
  const stateMap: { [key: string]: string } = {
    CA: "California",
    NY: "New York",
    TX: "Texas",
    FL: "Florida",
    IL: "Illinois",
    PA: "Pennsylvania",
    MA: "Massachusetts",
    WA: "Washington",
    GA: "Georgia",
    NC: "North Carolina",
    MI: "Michigan",
    MD: "Maryland",
    NJ: "New Jersey",
    CT: "Connecticut",
  };
  return stateMap[location] || location;
};

// Medical specialties list (ordered by popularity among pre-med students)
const medicalSpecialties = [
  "internal-medicine", // Most common specialty
  "family-medicine", // Primary care focus
  "pediatrics", // Popular with students
  "emergency-medicine", // High interest specialty
  "cardiology", // Competitive/prestigious
  "dermatology", // Highly competitive
  "orthopedic-surgery", // Surgical specialty
  "neurology", // Growing interest
  "psychiatry", // Mental health focus
  "radiology", // Diagnostic specialty
];

// Common locations list (ordered by popularity for pre-med students)
const commonLocations = [
  "CA", // California - most medical schools
  "NY", // New York - high concentration
  "TX", // Texas - large state, many schools
  "MA", // Massachusetts - Boston area
  "PA", // Pennsylvania - Philadelphia area
  "FL", // Florida - growing medical programs
  "IL", // Illinois - Chicago area
  "NC", // North Carolina - Research Triangle
  "MD", // Maryland - Baltimore area
  "WA", // Washington - Seattle area
  "GA", // Georgia - Atlanta area
  "MI", // Michigan - Detroit area
  "NJ", // New Jersey - NYC metro
  "CT", // Connecticut - Yale area
];

// Get top universities for pre-med students
const getTopUniversities = (): string[] => {
  return universities
    .filter(
      (u) =>
        u.type === "private" ||
        [
          "CA",
          "NY",
          "TX",
          "MA",
          "PA",
          "FL",
          "IL",
          "NC",
          "MD",
          "WA",
          "GA",
          "MI",
        ].includes(u.state)
    )
    .slice(0, 50) // Get first 50 which includes top universities
    .map((u) => u.name);
};

export default function MentorFeed() {
  const [currentView, setCurrentView] = useState<"feed" | "messaging">("feed");
  const [selectedMentee, setSelectedMentee] = useState<MenteeProfile | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("available-mentees");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 mentees per page
  const headerRef = useRef<HTMLElement>(null);
  const [searchResults, setSearchResults] = useState<MenteeProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [totalSearchResults, setTotalSearchResults] = useState(0);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [specialtyQuery, setSpecialtyQuery] = useState("");
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);

  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const [selectedUniversities, setSelectedUniversities] = useState<string[]>(
    []
  );
  const [universityQuery, setUniversityQuery] = useState("");
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] =
    useState(false);

  // Messaging state
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messageInput, setMessageInput] = useState<string>("");

  // Mock message data
  const mockConversations = [
    {
      id: "1",
      participant: {
        name: "Emily Chen",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face&auto=format",
        status: "Active now",
        specialty: "Cardiology",
      },
      lastMessage: {
        text: "Thank you for accepting me as your mentee! I'm really excited to learn from you.",
        timestamp: "2m",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      id: "2",
      participant: {
        name: "Marcus Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
        status: "Active 5m ago",
        specialty: "Neurosurgery",
      },
      lastMessage: {
        text: "I have some questions about the MCAT preparation timeline you mentioned...",
        timestamp: "1h",
        isRead: false,
      },
      unreadCount: 2,
    },
    {
      id: "3",
      participant: {
        name: "Sarah Kim",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format",
        status: "Active 2h ago",
        specialty: "Pediatrics",
      },
      lastMessage: {
        text: "The research opportunity you suggested sounds perfect!",
        timestamp: "3h",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      id: "4",
      participant: {
        name: "David Park",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format",
        status: "Active 1d ago",
        specialty: "Emergency Medicine",
      },
      lastMessage: {
        text: "Would you be available for a quick call this week?",
        timestamp: "1d",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      id: "5",
      participant: {
        name: "Jessica Wong",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face&auto=format",
        status: "Active 2d ago",
        specialty: "Dermatology",
      },
      lastMessage: {
        text: "Thanks for the med school application feedback!",
        timestamp: "2d",
        isRead: false,
      },
      unreadCount: 1,
    },
  ];

  const mockMessages = {
    "1": [
      {
        id: "1",
        senderId: "emily-chen",
        text: "Hi Dr. Johnson! Thank you so much for accepting me as your mentee. I'm really excited to work with you!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isOwn: false,
      },
      {
        id: "2",
        senderId: "mentor",
        text: "Welcome Emily! I'm excited to help guide you through your pre-med journey. What specific areas would you like to focus on first?",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
        isOwn: true,
      },
      {
        id: "3",
        senderId: "emily-chen",
        text: "I'm particularly interested in cardiology and would love to learn more about research opportunities. Also, I'm a bit nervous about the MCAT timeline.",
        timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(), // 1.2 hours ago
        isOwn: false,
      },
      {
        id: "4",
        senderId: "mentor",
        text: "Those are great areas to focus on! For cardiology research, I can connect you with Dr. Smith in our lab. As for the MCAT, what's your current timeline looking like?",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        isOwn: true,
      },
      {
        id: "5",
        senderId: "emily-chen",
        text: "Thank you for accepting me as your mentee! I'm really excited to learn from you.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        isOwn: false,
      },
    ],
    "2": [
      {
        id: "1",
        senderId: "marcus-rodriguez",
        text: "Hi Dr. Johnson, I hope you're doing well!",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isOwn: false,
      },
      {
        id: "2",
        senderId: "marcus-rodriguez",
        text: "I have some questions about the MCAT preparation timeline you mentioned in our last call. When do you think I should start studying?",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        isOwn: false,
      },
    ],
  };

  // Messages state and functions
  const [messages, setMessages] = useState<MessagesData>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Send message function
  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: "mentor-1", // Current user (mentor)
      text: messageInput.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [
        ...(prev[selectedConversation] || []),
        newMessage,
      ],
    }));

    setMessageInput("");

    // Scroll to bottom after message is sent
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handle enter key press in message input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll to bottom when conversation changes or messages update
  useEffect(() => {
    if (selectedConversation && messages[selectedConversation]) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [selectedConversation, messages]);

  // Server-side search function
  const performSearch = async (
    query: string,
    page: number = 1,
    specialties: string[] = selectedSpecialties,
    locations: string[] = selectedLocations,
    universities: string[] = selectedUniversities
  ) => {
    if (
      !query.trim() &&
      specialties.length === 0 &&
      locations.length === 0 &&
      universities.length === 0
    ) {
      setSearchResults([]);
      setTotalSearchResults(0);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      // Calculate offset for pagination
      const offset = (page - 1) * itemsPerPage;

      // Build search query
      let searchQuery = supabase
        .from("mentees")
        .select("*", { count: "exact" });

      // Add text search if query exists
      if (query.trim()) {
        const searchTermWildcard = `%${query.toLowerCase()}%`;
        searchQuery = searchQuery.or(
          `first_name.ilike.${searchTermWildcard},last_name.ilike.${searchTermWildcard},primary_specialty_interest.ilike.${searchTermWildcard},city_state.ilike.${searchTermWildcard},academic_level.ilike.${searchTermWildcard},application_target.ilike.${searchTermWildcard},mcat_status.ilike.${searchTermWildcard},preferred_mentorship_style.ilike.${searchTermWildcard},communication_frequency.ilike.${searchTermWildcard}`
        );
      }

      // Add specialty filters
      if (specialties.length > 0) {
        searchQuery = searchQuery.in("primary_specialty_interest", specialties);
      }

      // Add location filters (search for state codes in city_state field)
      if (locations.length > 0) {
        // Create OR conditions for each state code
        const locationConditions = locations
          .map((state) => `city_state.ilike.%${state}%`)
          .join(",");
        searchQuery = searchQuery.or(locationConditions);
      }

      // Add university filters
      if (universities.length > 0) {
        searchQuery = searchQuery.in("preferred_university", universities);
      }

      // Add pagination and ordering
      const { data, error, count } = await searchQuery
        .range(offset, offset + itemsPerPage - 1)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSearchResults(data || []);
      setTotalSearchResults(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
      setTotalSearchResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to filter mentees based on active tab
  const getFilteredMentees = () => {
    // Return empty array if no mentees available
    if (mentees.length === 0) {
      return [];
    }

    switch (activeTab) {
      case "available-mentees":
        return mentees; // Show all mentees
      case "your-matches":
        // For now, show first 3 mentees as "matches" (in real app, this would be based on match algorithm)
        return mentees.slice(0, Math.min(3, mentees.length));
      case "new-this-week":
        // Show mentees created in last 7 days (for demo, show up to 8)
        return mentees.slice(0, Math.min(8, mentees.length));
      case "saved-mentees":
        // For demo, show last 5 mentees as "saved"
        const savedCount = Math.min(5, mentees.length);
        return mentees.slice(-savedCount);
      default:
        return mentees;
    }
  };

  // Specialty filter functions
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  const clearSpecialtyFilters = () => {
    setSelectedSpecialties([]);
    setCurrentPage(1);
  };

  // Filter specialties for Combobox
  const availableSpecialties = medicalSpecialties.filter(
    (specialty) => !selectedSpecialties.includes(specialty)
  );

  const filteredSpecialties =
    specialtyQuery === ""
      ? availableSpecialties.slice(0, 6) // Show only top 6 most popular specialties when no search
      : availableSpecialties.filter((specialty) =>
          formatSpecialty(specialty)
            .toLowerCase()
            .includes(specialtyQuery.toLowerCase())
        );

  const addSpecialty = (specialty: string) => {
    if (specialty && !selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties((prev) => [...prev, specialty]);
      setSpecialtyQuery("");
      setCurrentPage(1);
    }
  };

  // Location filter functions
  const availableLocations = commonLocations.filter(
    (location) => !selectedLocations.includes(location)
  );

  const filteredLocations =
    locationQuery === ""
      ? availableLocations.slice(0, 5) // Show only top 5 most popular states when no search
      : availableLocations.filter((location) =>
          formatLocation(location)
            .toLowerCase()
            .includes(locationQuery.toLowerCase())
        );

  const addLocation = (location: string) => {
    if (location && !selectedLocations.includes(location)) {
      setSelectedLocations((prev) => [...prev, location]);
      setLocationQuery("");
      setCurrentPage(1);
    }
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) => prev.filter((l) => l !== location));
    setCurrentPage(1);
  };

  const clearLocationFilters = () => {
    setSelectedLocations([]);
    setCurrentPage(1);
  };

  // University filter functions
  const allUniversityNames = getTopUniversities();
  const availableUniversities = allUniversityNames.filter(
    (university) => !selectedUniversities.includes(university)
  );

  const filteredUniversities =
    universityQuery === ""
      ? availableUniversities.slice(0, 6) // Show only top 6 most popular universities when no search
      : availableUniversities.filter((university) =>
          university.toLowerCase().includes(universityQuery.toLowerCase())
        );

  const addUniversity = (university: string) => {
    if (university && !selectedUniversities.includes(university)) {
      setSelectedUniversities((prev) => [...prev, university]);
      setUniversityQuery("");
      setCurrentPage(1);
    }
  };

  const toggleUniversity = (university: string) => {
    setSelectedUniversities((prev) => prev.filter((u) => u !== university));
    setCurrentPage(1);
  };

  const clearUniversityFilters = () => {
    setSelectedUniversities([]);
    setCurrentPage(1);
  };

  // Determine which data to use: search results or filtered mentees
  const isActiveSearch =
    searchTerm.trim().length > 0 ||
    selectedSpecialties.length > 0 ||
    selectedLocations.length > 0 ||
    selectedUniversities.length > 0;
  const allFilteredMentees = isActiveSearch
    ? searchResults
    : getFilteredMentees();
  const totalResults = isActiveSearch
    ? totalSearchResults
    : allFilteredMentees.length;

  // Calculate pagination
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // For search results, don't slice (already paginated from server)
  // For regular results, slice for pagination
  const paginatedMentees = isActiveSearch
    ? searchResults
    : allFilteredMentees.slice(startIndex, endIndex);

  // Reset to page 1 when changing tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Handle page changes with scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // If we're in search mode, fetch search results for the new page
    if (isActiveSearch) {
      performSearch(
        searchTerm,
        page,
        selectedSpecialties,
        selectedLocations,
        selectedUniversities
      );
    }
  };

  // Handle search input with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to page 1 for new search
  };

  // Debounced search effect
  useEffect(() => {
    if (
      !searchTerm.trim() &&
      selectedSpecialties.length === 0 &&
      selectedLocations.length === 0 &&
      selectedUniversities.length === 0
    ) {
      setSearchResults([]);
      setTotalSearchResults(0);
      setIsSearching(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(
        searchTerm,
        currentPage,
        selectedSpecialties,
        selectedLocations,
        selectedUniversities
      );
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    currentPage,
    selectedSpecialties,
    selectedLocations,
    selectedUniversities,
  ]);

  // Scroll to top when page changes (but not on initial load)
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // Use requestAnimationFrame to ensure DOM is fully updated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Fallback for any containers that might be scrolled
        const scrollableElements = document.querySelectorAll("*");
        scrollableElements.forEach((el) => {
          if (el.scrollTop > 0) {
            el.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      });
    });
  }, [currentPage]);

  // Fetch mentees from Supabase
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("mentees")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(25);

        if (error) throw error;
        setMentees(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch mentees"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overscroll-none scrollbar-hide">
      {/* Header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center">
            <nav className="flex items-center space-x-8 text-sm">
              <span
                className={`font-medium cursor-pointer ${
                  currentView === "feed"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-primary-600 hover:text-primary-700"
                }`}
                onClick={() => setCurrentView("feed")}
              >
                FEED
              </span>
              <span
                className={`font-medium cursor-pointer ${
                  currentView === "messaging"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-primary-600 hover:text-primary-700"
                }`}
                onClick={() => setCurrentView("messaging")}
              >
                MESSAGES
              </span>
              <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                MATCHES
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

        {/* Loading Progress Bar - Positioned at bottom of header */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent">
          <div
            className={`h-full bg-gradient-to-r from-primary-400 to-primary-500 transition-all duration-200 ease-out ${
              currentView === "feed" && (loading || isSearching)
                ? "animate-pulse"
                : ""
            }`}
            style={{
              width:
                currentView === "feed" && (loading || isSearching)
                  ? "100%"
                  : "0%",
              transition: "width 0.2s ease-out",
            }}
          />
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
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none bg-white transition-all duration-200 focus:border-gray-400 rounded-md"
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

      {currentView === "feed" ? (
        <div className="max-w-7xl mx-auto flex">
          {/* Sidebar */}
          <div className="w-80 bg-white border-l border-r border-gray-200 min-h-screen p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">
                  Showing results for
                </h3>
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Specialty Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Medical Specialty
                </h4>
                {selectedSpecialties.length > 0 && (
                  <button
                    onClick={clearSpecialtyFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Selected Specialties */}
              {selectedSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedSpecialties.map((specialty) => (
                    <div
                      key={specialty}
                      className="bg-primary-100 text-primary-800 px-2 py-1 text-sm rounded border border-primary-500 flex items-center"
                    >
                      {formatSpecialty(specialty)}
                      <button
                        onClick={() => toggleSpecialty(specialty)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Specialty Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)
                  }
                  className="text-primary-600 text-sm hover:underline cursor-pointer"
                >
                  + Add specialty
                </button>

                {isSpecialtyDropdownOpen && (
                  <>
                    {/* Invisible overlay to close dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSpecialtyDropdownOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {/* Search bar at top */}
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none bg-white transition-all duration-200 focus:border-gray-400"
                          placeholder="Search specialties..."
                          value={specialtyQuery}
                          onChange={(event) =>
                            setSpecialtyQuery(event.target.value)
                          }
                          autoFocus
                        />
                      </div>

                      {/* Auto-expanding results */}
                      <div>
                        {filteredSpecialties.length === 0 &&
                        specialtyQuery !== "" ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No specialties found.
                          </div>
                        ) : (
                          filteredSpecialties.map((specialty) => (
                            <button
                              key={specialty}
                              onClick={() => {
                                addSpecialty(specialty);
                                setIsSpecialtyDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-primary-50 hover:text-primary-900 cursor-pointer"
                            >
                              {formatSpecialty(specialty)}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Locations
                </h4>
                {selectedLocations.length > 0 && (
                  <button
                    onClick={clearLocationFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Selected Locations */}
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedLocations.map((location) => (
                    <div
                      key={location}
                      className="bg-primary-100 text-primary-800 px-2 py-1 text-sm rounded border border-primary-500 flex items-center"
                    >
                      {formatLocation(location)}
                      <button
                        onClick={() => toggleLocation(location)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Location Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  }
                  className="text-primary-600 text-sm hover:underline cursor-pointer"
                >
                  + Add location
                </button>

                {isLocationDropdownOpen && (
                  <>
                    {/* Invisible overlay to close dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsLocationDropdownOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {/* Search bar at top */}
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none bg-white transition-all duration-200 focus:border-gray-400"
                          placeholder="Search locations..."
                          value={locationQuery}
                          onChange={(event) =>
                            setLocationQuery(event.target.value)
                          }
                          autoFocus
                        />
                      </div>

                      {/* Auto-expanding results */}
                      <div>
                        {filteredLocations.length === 0 &&
                        locationQuery !== "" ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No locations found.
                          </div>
                        ) : (
                          filteredLocations.map((location) => (
                            <button
                              key={location}
                              onClick={() => {
                                addLocation(location);
                                setIsLocationDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-primary-50 hover:text-primary-900 cursor-pointer"
                            >
                              {formatLocation(location)}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Universities */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Universities
                </h4>
                {selectedUniversities.length > 0 && (
                  <button
                    onClick={clearUniversityFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Selected Universities */}
              {selectedUniversities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedUniversities.map((university) => (
                    <div
                      key={university}
                      className="bg-primary-100 text-primary-800 px-2 py-1 text-sm rounded border border-primary-500 flex items-center"
                    >
                      {university}
                      <button
                        onClick={() => toggleUniversity(university)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add University Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsUniversityDropdownOpen(!isUniversityDropdownOpen)
                  }
                  className="text-primary-600 text-sm hover:underline cursor-pointer"
                >
                  + Add university
                </button>

                {isUniversityDropdownOpen && (
                  <>
                    {/* Invisible overlay to close dropdown */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUniversityDropdownOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute z-50 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {/* Search bar at top */}
                      <div className="p-2 border-b border-gray-100">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none bg-white transition-all duration-200 focus:border-gray-400"
                          placeholder="Search universities..."
                          value={universityQuery}
                          onChange={(event) =>
                            setUniversityQuery(event.target.value)
                          }
                          autoFocus
                        />
                      </div>

                      {/* Auto-expanding results */}
                      <div>
                        {filteredUniversities.length === 0 &&
                        universityQuery !== "" ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No universities found.
                          </div>
                        ) : (
                          filteredUniversities.map((university) => (
                            <button
                              key={university}
                              onClick={() => {
                                addUniversity(university);
                                setIsUniversityDropdownOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-primary-50 hover:text-primary-900 cursor-pointer"
                            >
                              {university}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
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
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none bg-white transition-all duration-200 focus:border-gray-400 rounded-md"
              />
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
          <div className="flex-1 bg-white border-r border-gray-200">
            {/* Results Header */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleTabChange("available-mentees")}
                className={`flex-1 text-center hover:bg-gray-50 py-4 border-r border-gray-200 bg-white ${
                  activeTab === "available-mentees"
                    ? "border-b-4 border-b-primary-600"
                    : ""
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    activeTab === "available-mentees"
                      ? "text-primary-600"
                      : "text-gray-900"
                  }`}
                >
                  {loading ? "..." : mentees.length}
                </div>
                <div
                  className={`text-sm ${
                    activeTab === "available-mentees"
                      ? "text-primary-600"
                      : "text-gray-600"
                  }`}
                >
                  available mentees
                </div>
              </button>
              <button
                onClick={() => handleTabChange("your-matches")}
                className={`flex-1 text-center hover:bg-gray-50 py-4 border-r border-gray-200 bg-white ${
                  activeTab === "your-matches"
                    ? "border-b-4 border-b-primary-600"
                    : ""
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    activeTab === "your-matches"
                      ? "text-primary-600"
                      : "text-gray-900"
                  }`}
                >
                  {loading ? "..." : Math.min(3, mentees.length)}
                </div>
                <div
                  className={`text-sm ${
                    activeTab === "your-matches"
                      ? "text-primary-600"
                      : "text-gray-600"
                  }`}
                >
                  your matches
                </div>
              </button>
              <button
                onClick={() => handleTabChange("new-this-week")}
                className={`flex-1 text-center hover:bg-gray-50 py-4 border-r border-gray-200 bg-white ${
                  activeTab === "new-this-week"
                    ? "border-b-4 border-b-primary-600"
                    : ""
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    activeTab === "new-this-week"
                      ? "text-primary-600"
                      : "text-gray-900"
                  }`}
                >
                  {loading ? "..." : Math.min(8, mentees.length)}
                </div>
                <div
                  className={`text-sm ${
                    activeTab === "new-this-week"
                      ? "text-primary-600"
                      : "text-gray-600"
                  }`}
                >
                  new this week
                </div>
              </button>
              <button
                onClick={() => handleTabChange("saved-mentees")}
                className={`flex-1 text-center hover:bg-gray-50 py-4 bg-white ${
                  activeTab === "saved-mentees"
                    ? "border-b-4 border-b-primary-600"
                    : ""
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    activeTab === "saved-mentees"
                      ? "text-primary-600"
                      : "text-gray-900"
                  }`}
                >
                  {loading ? "..." : Math.min(5, mentees.length)}
                </div>
                <div
                  className={`text-sm ${
                    activeTab === "saved-mentees"
                      ? "text-primary-600"
                      : "text-gray-600"
                  }`}
                >
                  saved mentees
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 px-6 py-3">
              <span>
                {isActiveSearch
                  ? `${totalSearchResults} ${
                      searchTerm.trim()
                        ? `search results for "${searchTerm}"`
                        : "filtered results"
                    } • Sorted by relevance`
                  : `${totalResults} results • Sorted by relevance`}
                {isSearching && " • Searching..."}
              </span>
              <span>
                {totalResults > 0
                  ? `${startIndex + 1} - ${Math.min(
                      isActiveSearch
                        ? startIndex + paginatedMentees.length
                        : endIndex,
                      totalResults
                    )}`
                  : ""}
              </span>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-white border-t border-gray-200 p-6 text-center">
                <p className="text-red-600">Error: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-primary-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading &&
              !error &&
              !isSearching &&
              ((isActiveSearch &&
                searchResults.length === 0 &&
                searchTerm.trim()) ||
                (!isActiveSearch &&
                  mentees.length > 0 &&
                  allFilteredMentees.length === 0)) && (
                <div className="bg-white border-t border-gray-200 p-12 text-center">
                  {isActiveSearch ? (
                    <div>
                      <p className="text-gray-600">
                        No mentees found for "{searchTerm}".
                      </p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-primary-600 hover:underline"
                      >
                        Clear search to view all mentees
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600">
                        No mentees found for this category.
                      </p>
                      <button
                        onClick={() => handleTabChange("available-mentees")}
                        className="mt-2 text-primary-600 hover:underline"
                      >
                        View all available mentees
                      </button>
                    </div>
                  )}
                </div>
              )}

            {/* Mentee Cards */}
            <div className="space-y-0">
              {!loading &&
                !error &&
                paginatedMentees.map((mentee) => (
                  <div
                    key={mentee.id}
                    className="bg-white border-t border-gray-200 p-6"
                  >
                    <div className="flex">
                      {/* Profile Image */}
                      <div className="flex-shrink-0 mr-4">
                        <button
                          onClick={() => setSelectedMentee(mentee)}
                          className="hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={getProfilePicture(
                              mentee.first_name,
                              mentee.last_name,
                              mentee.id
                            )}
                            alt={`${mentee.first_name} ${mentee.last_name}`}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        </button>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <button
                              onClick={() => setSelectedMentee(mentee)}
                              className="text-left hover:text-primary-600 transition-colors"
                            >
                              <h3 className="text-lg font-medium text-gray-900">
                                {mentee.first_name} {mentee.last_name}
                              </h3>
                            </button>
                            <p className="text-gray-600 text-sm mb-1">
                              {formatAcademicLevel(mentee.academic_level)} •
                              Pre-med
                            </p>
                            <p className="text-gray-500 text-sm flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {mentee.city_state || "Location not specified"}
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
                          <span>
                            MCAT: {mentee.mcat_status.replace(/-/g, " ")}
                          </span>
                          <span>
                            Target:{" "}
                            {formatSpecialty(mentee.primary_specialty_interest)}
                          </span>
                          <span>
                            Applying:{" "}
                            {mentee.application_target.replace(/-/g, " ")}
                          </span>
                        </div>

                        {/* Help Areas */}
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-1">
                            Seeking help with:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {mentee.help_areas.slice(0, 3).map((area) => (
                              <span
                                key={area}
                                className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs border border-primary-500"
                              >
                                {formatHelpArea(area)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Stats and Actions */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              Communication:{" "}
                              {mentee.communication_frequency.replace(
                                /-/g,
                                " "
                              )}
                            </span>
                            <span>
                              Preference: {mentee.preferred_mentorship_style}
                            </span>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              className="bg-primary-600 text-white px-6 py-2 text-sm font-medium rounded hover:bg-primary-700 transition-colors"
                              onClick={() => setSelectedMentee(mentee)}
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
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center px-6 pb-6">
                <nav className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border border-gray-300 text-sm rounded ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 text-sm rounded flex items-center justify-center ${
                          currentPage === page
                            ? "bg-primary-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border border-gray-300 text-sm rounded ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
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

              <div>
                <div className="text-center mb-4">
                  <img
                    src={getProfilePicture(
                      selectedMentee.first_name,
                      selectedMentee.last_name,
                      selectedMentee.id
                    )}
                    alt={`${selectedMentee.first_name} ${selectedMentee.last_name}`}
                    className="w-20 h-20 rounded-full mx-auto mb-2"
                  />
                  <h4 className="font-medium">
                    {selectedMentee.first_name} {selectedMentee.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatAcademicLevel(selectedMentee.academic_level)} •
                    Pre-med
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Target Specialty:</span>
                    <span className="ml-2">
                      {formatSpecialty(
                        selectedMentee.primary_specialty_interest
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Application Target:</span>
                    <span className="ml-2">
                      {selectedMentee.application_target.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">MCAT Status:</span>
                    <span className="ml-2">
                      {selectedMentee.mcat_status.replace(/-/g, " ")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">
                      {selectedMentee.city_state || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h5 className="font-medium mb-2">Help Areas:</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedMentee.help_areas.map((area) => (
                      <span
                        key={area}
                        className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs border border-primary-500"
                      >
                        {formatHelpArea(area)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors">
                    Accept as Mentee
                  </button>
                  <button className="w-full border border-primary-600 text-primary-600 py-2 rounded hover:bg-primary-50 transition-colors">
                    Pass
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Messaging View
        <div className="max-w-7xl mx-auto flex h-[calc(100vh-140px)]">
          {/* Left Panel - Conversations List */}
          <div className="w-80 bg-white border-l border-r border-gray-200 h-full flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Messages</h3>
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto space-y-0">
              {mockConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 relative ${
                    selectedConversation === conversation.id
                      ? "bg-gray-100"
                      : "bg-white"
                  }`}
                >
                  {selectedConversation === conversation.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600"></div>
                  )}
                  <div className="flex items-start space-x-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className={`text-sm font-medium text-gray-900 truncate ${
                            !conversation.lastMessage.isRead
                              ? "font-semibold"
                              : ""
                          }`}
                        >
                          {conversation.participant.name}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2">
                          {conversation.lastMessage.timestamp}
                        </span>
                      </div>
                      <p
                        className={`text-xs text-gray-600 truncate ${
                          !conversation.lastMessage.isRead
                            ? "font-medium text-gray-900"
                            : ""
                        }`}
                      >
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="flex-1 bg-white flex flex-col h-full border-r border-gray-200">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-2 border-b border-gray-200 bg-white">
                  {(() => {
                    const conversation = mockConversations.find(
                      (c) => c.id === selectedConversation
                    );
                    return conversation ? (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {conversation.participant.name}
                        </h3>
                        <p className="text-xs text-primary-600">
                          {conversation.participant.specialty}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto pt-4 px-4 space-y-4">
                  {messages[selectedConversation as keyof typeof messages]?.map(
                    (message) => {
                      const conversation = mockConversations.find(
                        (c) => c.id === selectedConversation
                      );
                      const mentorAvatar =
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format";

                      return (
                        <div key={message.id}>
                          {message.isOwn ? (
                            // Your messages (right-aligned)
                            <div className="flex items-start justify-end space-x-3">
                              <div className="flex flex-col items-end max-w-md">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(message.timestamp)}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    You
                                  </span>
                                </div>
                                <div className="bg-primary-600 text-white rounded-lg px-3 py-2">
                                  <p className="text-sm">{message.text}</p>
                                </div>
                              </div>
                              <img
                                src={mentorAvatar}
                                alt="Your profile"
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              />
                            </div>
                          ) : (
                            // Their messages (left-aligned)
                            <div className="flex items-start space-x-3">
                              <img
                                src={conversation?.participant.avatar}
                                alt={conversation?.participant.name}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex flex-col max-w-md">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {conversation?.participant.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(message.timestamp)}
                                  </span>
                                </div>
                                <div className="bg-gray-100 text-gray-900 rounded-lg px-3 py-2">
                                  <p className="text-sm">{message.text}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  ) || []}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="sticky bottom-0 bg-white pb-4 px-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none bg-white transition-all duration-200 focus:border-gray-400"
                    />
                    <button
                      onClick={sendMessage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700 transition-colors flex items-center justify-center w-8 h-8"
                    >
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No conversation selected */
              <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a mentee from the left to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
