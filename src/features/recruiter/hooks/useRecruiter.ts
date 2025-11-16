/**
 * Recruiter hook
 */

import { useState, useEffect, useCallback } from 'react';
import type { RecruiterProfile, JobPosting } from '../types';
import { RecruiterService } from '../services';

export function useRecruiter(userId?: string) {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchProfile();
    fetchJobPostings();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await RecruiterService.getProfile(userId);
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch recruiter profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobPostings = async () => {
    if (!userId) return;

    try {
      const data = await RecruiterService.getJobPostings(userId);
      setJobPostings(data);
    } catch (error) {
      console.error('Failed to fetch job postings:', error);
    }
  };

  const saveProfile = useCallback(async (profileData: Partial<RecruiterProfile>) => {
    const updated = await RecruiterService.saveProfile(profileData);
    setProfile(updated);
  }, []);

  const createJobPosting = useCallback(async (posting: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPosting = await RecruiterService.createJobPosting(posting);
    setJobPostings(prev => [newPosting, ...prev]);
    return newPosting;
  }, []);

  return {
    profile,
    jobPostings,
    loading,
    saveProfile,
    createJobPosting,
    refresh: fetchProfile,
  };
}

