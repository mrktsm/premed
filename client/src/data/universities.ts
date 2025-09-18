// Comprehensive list of US universities and colleges
// Data compiled from accredited institutions, focusing on those commonly attended by premed students

export interface University {
  name: string;
  state: string;
  type: 'public' | 'private' | 'community';
}

export const universities: University[] = [
  // Top Research Universities - Private
  { name: "Harvard University", state: "MA", type: "private" },
  { name: "Stanford University", state: "CA", type: "private" },
  { name: "Massachusetts Institute of Technology", state: "MA", type: "private" },
  { name: "Yale University", state: "CT", type: "private" },
  { name: "Princeton University", state: "NJ", type: "private" },
  { name: "Columbia University", state: "NY", type: "private" },
  { name: "University of Pennsylvania", state: "PA", type: "private" },
  { name: "Duke University", state: "NC", type: "private" },
  { name: "Northwestern University", state: "IL", type: "private" },
  { name: "Johns Hopkins University", state: "MD", type: "private" },
  { name: "Dartmouth College", state: "NH", type: "private" },
  { name: "Brown University", state: "RI", type: "private" },
  { name: "Cornell University", state: "NY", type: "private" },
  { name: "Rice University", state: "TX", type: "private" },
  { name: "Vanderbilt University", state: "TN", type: "private" },
  { name: "Washington University in St. Louis", state: "MO", type: "private" },
  { name: "Emory University", state: "GA", type: "private" },
  { name: "Georgetown University", state: "DC", type: "private" },
  { name: "University of Notre Dame", state: "IN", type: "private" },
  { name: "Carnegie Mellon University", state: "PA", type: "private" },

  // Top Public Research Universities
  { name: "University of California, Berkeley", state: "CA", type: "public" },
  { name: "University of California, Los Angeles", state: "CA", type: "public" },
  { name: "University of California, San Diego", state: "CA", type: "public" },
  { name: "University of California, San Francisco", state: "CA", type: "public" },
  { name: "University of California, Irvine", state: "CA", type: "public" },
  { name: "University of California, Davis", state: "CA", type: "public" },
  { name: "University of California, Santa Barbara", state: "CA", type: "public" },
  { name: "University of California, Santa Cruz", state: "CA", type: "public" },
  { name: "University of California, Riverside", state: "CA", type: "public" },
  { name: "University of California, Merced", state: "CA", type: "public" },
  { name: "University of Michigan", state: "MI", type: "public" },
  { name: "University of Virginia", state: "VA", type: "public" },
  { name: "University of North Carolina at Chapel Hill", state: "NC", type: "public" },
  { name: "Georgia Institute of Technology", state: "GA", type: "public" },
  { name: "University of Wisconsin-Madison", state: "WI", type: "public" },
  { name: "University of Illinois at Urbana-Champaign", state: "IL", type: "public" },
  { name: "University of Texas at Austin", state: "TX", type: "public" },
  { name: "Texas A&M University", state: "TX", type: "public" },
  { name: "University of Florida", state: "FL", type: "public" },
  { name: "Ohio State University", state: "OH", type: "public" },
  { name: "University of Washington", state: "WA", type: "public" },
  { name: "Pennsylvania State University", state: "PA", type: "public" },
  { name: "Purdue University", state: "IN", type: "public" },
  { name: "University of Maryland", state: "MD", type: "public" },
  { name: "University of Georgia", state: "GA", type: "public" },

  // State Universities by State
  // Alabama
  { name: "University of Alabama", state: "AL", type: "public" },
  { name: "Auburn University", state: "AL", type: "public" },
  { name: "University of Alabama at Birmingham", state: "AL", type: "public" },
  { name: "Alabama State University", state: "AL", type: "public" },

  // Alaska
  { name: "University of Alaska Anchorage", state: "AK", type: "public" },
  { name: "University of Alaska Fairbanks", state: "AK", type: "public" },

  // Arizona
  { name: "Arizona State University", state: "AZ", type: "public" },
  { name: "University of Arizona", state: "AZ", type: "public" },
  { name: "Northern Arizona University", state: "AZ", type: "public" },

  // Arkansas
  { name: "University of Arkansas", state: "AR", type: "public" },
  { name: "Arkansas State University", state: "AR", type: "public" },

  // Colorado
  { name: "University of Colorado Boulder", state: "CO", type: "public" },
  { name: "Colorado State University", state: "CO", type: "public" },
  { name: "University of Colorado Denver", state: "CO", type: "public" },
  { name: "University of Denver", state: "CO", type: "private" },

  // Connecticut
  { name: "University of Connecticut", state: "CT", type: "public" },
  { name: "Wesleyan University", state: "CT", type: "private" },
  { name: "Trinity College", state: "CT", type: "private" },

  // Delaware
  { name: "University of Delaware", state: "DE", type: "public" },

  // Florida
  { name: "Florida State University", state: "FL", type: "public" },
  { name: "University of Central Florida", state: "FL", type: "public" },
  { name: "Florida International University", state: "FL", type: "public" },
  { name: "University of Miami", state: "FL", type: "private" },
  { name: "Florida Institute of Technology", state: "FL", type: "private" },

  // Georgia
  { name: "Georgia State University", state: "GA", type: "public" },
  { name: "University of Georgia", state: "GA", type: "public" },
  { name: "Georgia Southern University", state: "GA", type: "public" },
  { name: "Morehouse College", state: "GA", type: "private" },
  { name: "Spelman College", state: "GA", type: "private" },

  // Hawaii
  { name: "University of Hawaii at Manoa", state: "HI", type: "public" },

  // Idaho
  { name: "University of Idaho", state: "ID", type: "public" },
  { name: "Boise State University", state: "ID", type: "public" },

  // Illinois
  { name: "University of Illinois at Chicago", state: "IL", type: "public" },
  { name: "Northern Illinois University", state: "IL", type: "public" },
  { name: "Southern Illinois University", state: "IL", type: "public" },
  { name: "University of Chicago", state: "IL", type: "private" },
  { name: "Loyola University Chicago", state: "IL", type: "private" },

  // Indiana
  { name: "Indiana University", state: "IN", type: "public" },
  { name: "Ball State University", state: "IN", type: "public" },
  { name: "Butler University", state: "IN", type: "private" },

  // Iowa
  { name: "University of Iowa", state: "IA", type: "public" },
  { name: "Iowa State University", state: "IA", type: "public" },
  { name: "Grinnell College", state: "IA", type: "private" },

  // Kansas
  { name: "University of Kansas", state: "KS", type: "public" },
  { name: "Kansas State University", state: "KS", type: "public" },

  // Kentucky
  { name: "University of Kentucky", state: "KY", type: "public" },
  { name: "University of Louisville", state: "KY", type: "public" },

  // Louisiana
  { name: "Louisiana State University", state: "LA", type: "public" },
  { name: "Tulane University", state: "LA", type: "private" },

  // Maine
  { name: "University of Maine", state: "ME", type: "public" },
  { name: "Bowdoin College", state: "ME", type: "private" },
  { name: "Colby College", state: "ME", type: "private" },

  // Maryland
  { name: "University of Maryland, Baltimore County", state: "MD", type: "public" },
  { name: "Towson University", state: "MD", type: "public" },

  // Massachusetts
  { name: "University of Massachusetts Amherst", state: "MA", type: "public" },
  { name: "Boston University", state: "MA", type: "private" },
  { name: "Northeastern University", state: "MA", type: "private" },
  { name: "Tufts University", state: "MA", type: "private" },
  { name: "Williams College", state: "MA", type: "private" },
  { name: "Amherst College", state: "MA", type: "private" },
  { name: "Wellesley College", state: "MA", type: "private" },
  { name: "Boston College", state: "MA", type: "private" },

  // Michigan
  { name: "Michigan State University", state: "MI", type: "public" },
  { name: "Wayne State University", state: "MI", type: "public" },
  { name: "Western Michigan University", state: "MI", type: "public" },

  // Minnesota
  { name: "University of Minnesota", state: "MN", type: "public" },
  { name: "Carleton College", state: "MN", type: "private" },
  { name: "Macalester College", state: "MN", type: "private" },

  // Mississippi
  { name: "University of Mississippi", state: "MS", type: "public" },
  { name: "Mississippi State University", state: "MS", type: "public" },

  // Missouri
  { name: "University of Missouri", state: "MO", type: "public" },
  { name: "Missouri State University", state: "MO", type: "public" },
  { name: "Saint Louis University", state: "MO", type: "private" },

  // Montana
  { name: "University of Montana", state: "MT", type: "public" },
  { name: "Montana State University", state: "MT", type: "public" },

  // Nebraska
  { name: "University of Nebraska", state: "NE", type: "public" },
  { name: "Creighton University", state: "NE", type: "private" },

  // Nevada
  { name: "University of Nevada, Las Vegas", state: "NV", type: "public" },
  { name: "University of Nevada, Reno", state: "NV", type: "public" },

  // New Hampshire
  { name: "University of New Hampshire", state: "NH", type: "public" },

  // New Jersey
  { name: "Rutgers University", state: "NJ", type: "public" },
  { name: "Seton Hall University", state: "NJ", type: "private" },

  // New Mexico
  { name: "University of New Mexico", state: "NM", type: "public" },
  { name: "New Mexico State University", state: "NM", type: "public" },

  // New York
  { name: "State University of New York at Stony Brook", state: "NY", type: "public" },
  { name: "State University of New York at Buffalo", state: "NY", type: "public" },
  { name: "State University of New York at Albany", state: "NY", type: "public" },
  { name: "New York University", state: "NY", type: "private" },
  { name: "Fordham University", state: "NY", type: "private" },
  { name: "Syracuse University", state: "NY", type: "private" },
  { name: "University of Rochester", state: "NY", type: "private" },
  { name: "Rensselaer Polytechnic Institute", state: "NY", type: "private" },
  { name: "Barnard College", state: "NY", type: "private" },
  { name: "Vassar College", state: "NY", type: "private" },

  // North Carolina
  { name: "North Carolina State University", state: "NC", type: "public" },
  { name: "East Carolina University", state: "NC", type: "public" },
  { name: "Wake Forest University", state: "NC", type: "private" },
  { name: "Davidson College", state: "NC", type: "private" },

  // North Dakota
  { name: "University of North Dakota", state: "ND", type: "public" },
  { name: "North Dakota State University", state: "ND", type: "public" },

  // Ohio
  { name: "University of Cincinnati", state: "OH", type: "public" },
  { name: "Miami University", state: "OH", type: "public" },
  { name: "Kent State University", state: "OH", type: "public" },
  { name: "Case Western Reserve University", state: "OH", type: "private" },
  { name: "Oberlin College", state: "OH", type: "private" },

  // Oklahoma
  { name: "University of Oklahoma", state: "OK", type: "public" },
  { name: "Oklahoma State University", state: "OK", type: "public" },

  // Oregon
  { name: "University of Oregon", state: "OR", type: "public" },
  { name: "Oregon State University", state: "OR", type: "public" },
  { name: "Reed College", state: "OR", type: "private" },

  // Pennsylvania
  { name: "Temple University", state: "PA", type: "public" },
  { name: "University of Pittsburgh", state: "PA", type: "public" },
  { name: "Swarthmore College", state: "PA", type: "private" },
  { name: "Haverford College", state: "PA", type: "private" },
  { name: "Bryn Mawr College", state: "PA", type: "private" },
  { name: "Lafayette College", state: "PA", type: "private" },
  { name: "Lehigh University", state: "PA", type: "private" },
  { name: "Bucknell University", state: "PA", type: "private" },

  // Rhode Island
  { name: "University of Rhode Island", state: "RI", type: "public" },

  // South Carolina
  { name: "University of South Carolina", state: "SC", type: "public" },
  { name: "Clemson University", state: "SC", type: "public" },

  // South Dakota
  { name: "University of South Dakota", state: "SD", type: "public" },
  { name: "South Dakota State University", state: "SD", type: "public" },

  // Tennessee
  { name: "University of Tennessee", state: "TN", type: "public" },
  { name: "Tennessee State University", state: "TN", type: "public" },

  // Texas
  { name: "University of Houston", state: "TX", type: "public" },
  { name: "Texas Tech University", state: "TX", type: "public" },
  { name: "University of North Texas", state: "TX", type: "public" },
  { name: "Baylor University", state: "TX", type: "private" },
  { name: "Southern Methodist University", state: "TX", type: "private" },
  { name: "Texas Christian University", state: "TX", type: "private" },

  // Utah
  { name: "University of Utah", state: "UT", type: "public" },
  { name: "Utah State University", state: "UT", type: "public" },
  { name: "Brigham Young University", state: "UT", type: "private" },

  // Vermont
  { name: "University of Vermont", state: "VT", type: "public" },
  { name: "Middlebury College", state: "VT", type: "private" },

  // Virginia
  { name: "Virginia Tech", state: "VA", type: "public" },
  { name: "James Madison University", state: "VA", type: "public" },
  { name: "Virginia Commonwealth University", state: "VA", type: "public" },
  { name: "Washington and Lee University", state: "VA", type: "private" },
  { name: "University of Richmond", state: "VA", type: "private" },

  // Washington
  { name: "Washington State University", state: "WA", type: "public" },
  { name: "Western Washington University", state: "WA", type: "public" },
  { name: "Whitman College", state: "WA", type: "private" },

  // West Virginia
  { name: "West Virginia University", state: "WV", type: "public" },

  // Wisconsin
  { name: "University of Wisconsin-Milwaukee", state: "WI", type: "public" },
  { name: "Marquette University", state: "WI", type: "private" },

  // Wyoming
  { name: "University of Wyoming", state: "WY", type: "public" },

  // Historically Black Colleges and Universities (HBCUs)
  { name: "Howard University", state: "DC", type: "private" },
  { name: "Florida A&M University", state: "FL", type: "public" },
  { name: "North Carolina A&T State University", state: "NC", type: "public" },
  { name: "Tennessee State University", state: "TN", type: "public" },
  { name: "Prairie View A&M University", state: "TX", type: "public" },
  { name: "Xavier University of Louisiana", state: "LA", type: "private" },

  // Additional Notable Institutions
  { name: "California Institute of Technology", state: "CA", type: "private" },
  { name: "Pomona College", state: "CA", type: "private" },
  { name: "Claremont McKenna College", state: "CA", type: "private" },
  { name: "Harvey Mudd College", state: "CA", type: "private" },
  { name: "Scripps College", state: "CA", type: "private" },
  { name: "Pitzer College", state: "CA", type: "private" },
  { name: "University of Southern California", state: "CA", type: "private" },
  { name: "Pepperdine University", state: "CA", type: "private" },
];

// Helper function to search universities
export const searchUniversities = (query: string, limit: number = 10): University[] => {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  
  return universities
    .filter(university => 
      university.name.toLowerCase().includes(lowercaseQuery) ||
      university.state.toLowerCase().includes(lowercaseQuery)
    )
    .slice(0, limit);
};

// Helper function to get universities by state
export const getUniversitiesByState = (state: string): University[] => {
  return universities.filter(university => 
    university.state.toLowerCase() === state.toLowerCase()
  );
};

// Helper function to get all university names
export const getAllUniversityNames = (): string[] => {
  return universities.map(university => university.name).sort();
};
