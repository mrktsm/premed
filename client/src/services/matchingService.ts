import { supabase } from "../lib/supabase";
import type { MenteeProfile, MentorProfile } from "../lib/supabase";

interface MatchScore {
  mentorId: string;
  mentor: MentorProfile;
  score: number;
  factors: {
    specialty: number;
    helpAreas: number;
    communication: number;
    background: number;
    degreeTrack: number;
    mentorshipStyle: number;
    timeline: number;
  };
}

// Matching weights based on the specification
const WEIGHTS = {
  specialty: 9,
  helpAreas: 9,
  timeline: 7,
  mentorshipStyle: 7,
  communication: 7,
  degreeTrack: 6,
  background: 6,
};

export class MatchingService {
  static async findMatches(menteeData: any): Promise<MatchScore[]> {
    try {
      console.log("=== MATCHING DEBUG START ===");
      console.log("Mentee data received:", menteeData);

      // Get all available mentors
      const { data: mentors, error } = await supabase
        .from("mentors")
        .select("*");

      console.log("Supabase mentors query result:", { mentors, error });

      if (error) {
        console.error("Error fetching mentors:", error);
        return [];
      }

      if (!mentors || mentors.length === 0) {
        console.log("No mentors found - RLS issue or empty table");
        return [];
      }

      console.log(
        `Found ${mentors.length} mentors:`,
        mentors.map((m) => ({
          id: m.id,
          name: m.first_name,
          specialty: m.medical_specialty,
        }))
      );

      // Calculate match scores for each mentor
      const matches = mentors.map((mentor) => {
        const match = this.calculateMatchScore(menteeData, mentor);
        console.log(
          `Score for ${mentor.first_name}: ${match.score}`,
          match.factors
        );
        return match;
      });

      console.log(
        "All match scores:",
        matches.map((m) => ({ name: m.mentor.first_name, score: m.score }))
      );

      // Sort by score (highest first) and return top matches
      const filteredMatches = matches.filter((match) => match.score > 0); // Lowered threshold for debugging
      console.log(`Matches above threshold (>30):`, filteredMatches.length);

      const topMatches = filteredMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Top 5 matches

      console.log("=== MATCHING DEBUG END ===");
      return topMatches;
    } catch (error) {
      console.error("Error in matching service:", error);
      return [];
    }
  }

  static calculateMatchScore(mentee: any, mentor: MentorProfile): MatchScore {
    let totalScore = 0;
    const factors = {
      specialty: 0,
      helpAreas: 0,
      communication: 0,
      background: 0,
      degreeTrack: 0,
      mentorshipStyle: 0,
      timeline: 0,
    };

    // 1. Specialty Match (Weight: 9) - Highest priority
    const menteeSpecialty =
      mentee.primarySpecialtyInterest || mentee.primary_specialty_interest;
    if (menteeSpecialty === mentor.medical_specialty) {
      factors.specialty = WEIGHTS.specialty;
      totalScore += factors.specialty;
    }

    // 2. Help Areas vs Expertise (Weight: 9)
    const menteeHelpAreas = mentee.helpAreas || mentee.help_areas || [];
    const mentorExpertise = mentor.areas_of_expertise || [];
    const helpAreaOverlap = menteeHelpAreas.filter((area: string) =>
      mentorExpertise.includes(area)
    ).length;

    if (helpAreaOverlap > 0) {
      factors.helpAreas = Math.min(helpAreaOverlap * 3, WEIGHTS.helpAreas);
      totalScore += factors.helpAreas;
    }

    // 3. Application Timeline vs Career Stage (Weight: 7)
    const timelineScore = this.calculateTimelineMatch(
      mentee.applicationTarget || mentee.application_target,
      mentor.career_stage
    );
    factors.timeline = timelineScore;
    totalScore += factors.timeline;

    // 4. Mentorship Style Match (Weight: 7)
    const menteeStyle =
      mentee.preferredMentorshipStyle || mentee.preferred_mentorship_style;
    if (menteeStyle === mentor.mentorship_style) {
      factors.mentorshipStyle = WEIGHTS.mentorshipStyle;
      totalScore += factors.mentorshipStyle;
    } else if (mentor.mentorship_style === "mix") {
      // Mentors who do "mix" are compatible with any style
      factors.mentorshipStyle = WEIGHTS.mentorshipStyle * 0.7;
      totalScore += factors.mentorshipStyle;
    }

    // 5. Communication Preferences (Weight: 7)
    const communicationScore = this.calculateCommunicationMatch(
      mentee.communicationFrequency || mentee.communication_frequency,
      mentee.communicationModes || mentee.communication_modes || [],
      mentor.communication_frequency,
      mentor.communication_modes || []
    );
    factors.communication = communicationScore;
    totalScore += factors.communication;

    // 6. Degree Track Match (Weight: 6)
    const degreeScore = this.calculateDegreeMatch(
      mentee.degreeTrackPreference || mentee.degree_track_preference,
      mentor.degree
    );
    factors.degreeTrack = degreeScore;
    totalScore += factors.degreeTrack;

    // 7. Background Similarity (Weight: 6)
    const backgroundScore = this.calculateBackgroundMatch(
      mentee.applicantBackground || mentee.applicant_background || [],
      mentor.applicant_background || []
    );
    factors.background = backgroundScore;
    totalScore += factors.background;

    // 8. Optional: Gender preference (Weight: 2)
    if (
      mentee.preferMentorSameGender &&
      mentee.preferredGender === mentor.gender
    ) {
      totalScore += 2;
    }

    // 9. Optional: Alumni preference (Weight: 2)
    if (
      mentee.preferAlumniMentor &&
      mentee.preferredUniversity === mentor.alma_mater
    ) {
      totalScore += 2;
    }

    return {
      mentorId: mentor.id,
      mentor,
      score: Math.round(totalScore),
      factors,
    };
  }

  private static calculateTimelineMatch(
    menteeTimeline: string,
    mentorStage: string
  ): number {
    // Urgent mentees (next 6 months) get priority with experienced mentors
    if (menteeTimeline === "next-6-months") {
      if (
        mentorStage === "attending-physician" ||
        mentorStage === "resident-fellow"
      ) {
        return WEIGHTS.timeline;
      }
      if (mentorStage === "medical-student-m3-m4") {
        return WEIGHTS.timeline * 0.7;
      }
    }

    // Medium-term mentees work well with residents and senior students
    if (menteeTimeline === "in-1-2-years") {
      if (
        mentorStage === "resident-fellow" ||
        mentorStage === "medical-student-m3-m4"
      ) {
        return WEIGHTS.timeline;
      }
      if (mentorStage === "attending-physician") {
        return WEIGHTS.timeline * 0.8;
      }
    }

    // Long-term mentees can work with any mentor level
    if (menteeTimeline === "in-3-plus-years" || menteeTimeline === "not-sure") {
      return WEIGHTS.timeline * 0.6; // Lower priority but still valuable
    }

    return 0;
  }

  private static calculateCommunicationMatch(
    menteeFreq: string,
    menteeModes: string[],
    mentorFreq: string,
    mentorModes: string[]
  ): number {
    let score = 0;

    // Frequency match
    if (menteeFreq === mentorFreq) {
      score += WEIGHTS.communication * 0.6;
    } else {
      // Compatible frequencies
      const compatiblePairs = [
        ["weekly", "bi-weekly"],
        ["bi-weekly", "monthly"],
        ["monthly", "as-needed"],
      ];

      const isCompatible = compatiblePairs.some(
        ([freq1, freq2]) =>
          (menteeFreq === freq1 && mentorFreq === freq2) ||
          (menteeFreq === freq2 && mentorFreq === freq1)
      );

      if (isCompatible) {
        score += WEIGHTS.communication * 0.3;
      }
    }

    // Communication modes overlap
    const modeOverlap = menteeModes.filter((mode) =>
      mentorModes.includes(mode)
    ).length;
    if (modeOverlap > 0) {
      score += WEIGHTS.communication * 0.4 * (modeOverlap / menteeModes.length);
    }

    return Math.round(score);
  }

  private static calculateDegreeMatch(
    menteeTrack: string,
    mentorDegree: string
  ): number {
    // Exact matches
    if (menteeTrack === "md" && mentorDegree === "md")
      return WEIGHTS.degreeTrack;
    if (menteeTrack === "do" && mentorDegree === "do")
      return WEIGHTS.degreeTrack;
    if (menteeTrack === "both") {
      if (mentorDegree === "md" || mentorDegree === "do") {
        return WEIGHTS.degreeTrack * 0.8;
      }
    }

    // MD/PhD mentors are valuable for any track
    if (mentorDegree === "md-phd") {
      return WEIGHTS.degreeTrack * 0.7;
    }

    return 0;
  }

  private static calculateBackgroundMatch(
    menteeBackground: string[],
    mentorBackground: string[]
  ): number {
    const overlap = menteeBackground.filter((bg) =>
      mentorBackground.includes(bg)
    ).length;

    if (overlap === 0) return 0;

    // High weight for shared experiences like first-gen, URM
    const highValueBg = ["first-gen", "urm", "non-traditional"];
    const highValueOverlap = menteeBackground.filter(
      (bg) => highValueBg.includes(bg) && mentorBackground.includes(bg)
    ).length;

    if (highValueOverlap > 0) {
      return WEIGHTS.background;
    }

    // General background match
    return Math.round(WEIGHTS.background * (overlap / menteeBackground.length));
  }

  static async saveMatches(
    menteeId: string,
    matches: MatchScore[]
  ): Promise<void> {
    try {
      const matchRecords = matches.map((match) => ({
        mentee_id: menteeId,
        mentor_id: match.mentorId,
        match_score: match.score,
        status: "pending" as const,
      }));

      const { error } = await supabase.from("matches").insert(matchRecords);

      if (error) {
        console.error("Error saving matches:", error);
      } else {
        console.log(`Saved ${matches.length} matches for mentee ${menteeId}`);
      }
    } catch (error) {
      console.error("Error in saveMatches:", error);
    }
  }
}
