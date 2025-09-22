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
  academic_level: string;
  university: string;
  has_university: boolean;
  primary_specialty: string;
  md_do_interest: string;
  applicant_type: string;
  gender_identity: string;
  guidance_areas: string[];
  mentorship_goals: string[];
  communication_mode: string;
  meeting_frequency: string;
  geographical_preference: string;
  research_experience: string;
  research_interest: string;
  similar_identity_preference: string;
  mcat_status: string;
  application_timeline: string;
  created_at: string;
}

export interface MentorProfile {
  id: string;
  first_name: string;
  last_name: string;
  primary_specialty: string;
  career_stage: string;
  education_type: string;
  research_field: string;
  research_experience: string;
  applicant_type_experience: string;
  mentorship_style: string;
  comfortable_topics: string[];
  communication_mode: string;
  meeting_frequency: string;
  geographical_openness: string;
  gender_identity: string;
  similar_identity_importance: string;
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
