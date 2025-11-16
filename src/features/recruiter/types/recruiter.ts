/**
 * Recruiter feature type definitions
 */

export interface RecruiterProfile {
  id: string;
  userId: string;
  company: string;
  companyWebsite?: string;
  jobTitle: string;
  bio?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobPosting {
  id: string;
  recruiterId: string;
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  remote: boolean;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  status: 'draft' | 'published' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  userId: string;
  username: string;
  email: string;
  skills: string[];
  experience: number; // years
  talentScore?: number;
}

export interface SavedCandidate {
  id: string;
  recruiterId: string;
  candidateId: string;
  jobPostingId?: string;
  notes?: string;
  status: 'interested' | 'contacted' | 'interviewing' | 'offered' | 'rejected';
  savedAt: Date;
}

export interface CandidateSearch {
  skills?: string[];
  minExperience?: number;
  maxExperience?: number;
  location?: string;
  remote?: boolean;
  minTalentScore?: number;
}

