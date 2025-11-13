/**
 * Mentorship program management
 */

export interface MentorshipPair {
  id: string
  mentorId: string
  menteeId: string
  status: 'active' | 'completed' | 'paused'
  startDate: Date
  goals: string[]
  meetings: Meeting[]
}

export interface Meeting {
  id: string
  date: Date
  duration: number
  notes: string
  topics: string[]
}

export class MentorshipProgram {
  static createPair(mentorId: string, menteeId: string, goals: string[]): MentorshipPair {
    return {
      id: `mentor-${Date.now()}`,
      mentorId,
      menteeId,
      status: 'active',
      startDate: new Date(),
      goals,
      meetings: [],
    }
  }

  static addMeeting(pair: MentorshipPair, meeting: Omit<Meeting, 'id'>): MentorshipPair {
    return {
      ...pair,
      meetings: [
        ...pair.meetings,
        { ...meeting, id: `meeting-${Date.now()}` },
      ],
    }
  }

  static calculateProgress(pair: MentorshipPair): {
    totalMeetings: number
    totalHours: number
    completedGoals: number
    progressPercent: number
  } {
    const totalMeetings = pair.meetings.length
    const totalHours = pair.meetings.reduce((sum, m) => sum + m.duration, 0)
    const completedGoals = Math.floor(pair.goals.length * 0.6) // Mock
    const progressPercent = Math.min(100, (completedGoals / pair.goals.length) * 100)

    return { totalMeetings, totalHours, completedGoals, progressPercent }
  }
}

