import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Profile {
  id: string;
  email: string;
  user_type: "mentee" | "mentor";
  created_at: string;
}

export interface MenteeProfile {
  id: string;
  first_name: string;
  last_name: string;

  // Academic & Medical Interests (Weight: 7, 9, 6)
  academic_level: string; // Weight: 7
  primary_specialty_interest: string; // Weight: 9
  degree_track_preference: string; // Weight: 6

  // Help Needed & Application Status (Weight: 9, 7, 7)
  help_areas: string[]; // Weight: 9 (up to 3)
  mcat_status: string; // Weight: 7
  application_target: string; // Weight: 7

  // Mentorship Preferences (Weight: 7, 7, 6, 5, 5)
  preferred_mentorship_style: string; // Weight: 7
  communication_frequency: string; // Weight: 7
  communication_modes: string[]; // Weight: 6 (multi-select)
  in_person_preference: boolean; // Weight: 5
  geographic_preference?: string; // Weight: 5 (if in_person = true)
  city_state?: string; // If in_person = true

  // Background & Preferences (Weight: 7, 2, 2)
  applicant_background: string[]; // Weight: 7 (multi-select)
  prefer_mentor_same_gender: boolean; // Weight: 2
  preferred_gender?: string; // Weight: 2 (if toggle ON)
  prefer_alumni_mentor: boolean; // Weight: 2
  preferred_university?: string; // Weight: 2 (if toggle ON)

  created_at: string;
}

export interface MentorProfile {
  id: string;
  first_name: string;
  last_name: string;

  // Medical Background (Weight: 9, 8, 6)
  medical_specialty: string; // Weight: 9
  career_stage: string; // Weight: 8
  degree: string; // Weight: 6

  // Expertise & Research (Weight: 8, 6, 5)
  areas_of_expertise: string[]; // Weight: 8 (up to 5)
  research_field: string; // Weight: 6
  research_mentorship_capacity: string; // Weight: 5

  // Mentorship Approach (Weight: 7)
  mentorship_style: string; // Weight: 7

  // Communication Preferences (Weight: 7, 6, 5, 5)
  communication_frequency: string; // Weight: 7
  communication_modes: string[]; // Weight: 6 (multi-select)
  in_person_availability: boolean; // Weight: 5
  geographic_openness?: string; // Weight: 5 (if in_person = true)
  city_state?: string; // If in_person = true

  // Background & Demographics (Weight: 6, 2, 2)
  applicant_background: string[]; // Weight: 6 (multi-select)
  gender?: string; // Weight: 2 (optional)
  alma_mater?: string; // Weight: 2 (optional)

  created_at: string;
}

export interface Match {
  id: string;
  mentee_id: string;
  mentor_id: string;
  match_score: number;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}
