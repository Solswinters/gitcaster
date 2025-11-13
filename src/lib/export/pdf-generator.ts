/**
 * PDF generation utility for profile exports
 * Uses puppeteer or react-pdf for generation
 */

export interface PDFOptions {
  theme?: 'professional' | 'creative' | 'minimal'
  includeGitHubStats?: boolean
  includeTalentScore?: boolean
  includeSkills?: boolean
  includeExperience?: boolean
  includeEducation?: boolean
}

export async function generateProfilePDF(
  profileSlug: string,
  options: PDFOptions = {}
): Promise<Blob> {
  // In a real implementation, this would use puppeteer or react-pdf
  // For now, we'll create a placeholder
  
  const {
    theme = 'professional',
    includeGitHubStats = true,
    includeTalentScore = true,
    includeSkills = true,
    includeExperience = true,
    includeEducation = true,
  } = options

  // Fetch profile data
  const response = await fetch(`/api/profile/${profileSlug}`)
  if (!response.ok) {
    throw new Error('Failed to fetch profile')
  }

  const profile = await response.json()

  // Generate HTML content for PDF
  const html = generatePDFHTML(profile, {
    theme,
    includeGitHubStats,
    includeTalentScore,
    includeSkills,
    includeExperience,
    includeEducation,
  })

  // In production, use puppeteer to convert HTML to PDF
  // For now, return a mock blob
  return new Blob([html], { type: 'application/pdf' })
}

function generatePDFHTML(profile: any, options: PDFOptions): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${profile.displayName || profile.user.githubUsername} - Developer Profile</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      color: #1f2937;
    }
    .header .subtitle {
      color: #6b7280;
      font-size: 16px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      font-size: 20px;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .bio {
      line-height: 1.6;
      color: #4b5563;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-tag {
      padding: 6px 12px;
      background: #eff6ff;
      color: #1e40af;
      border-radius: 4px;
      font-size: 14px;
    }
    .experience-item,
    .education-item {
      margin-bottom: 20px;
    }
    .experience-item h3,
    .education-item h3 {
      margin: 0 0 4px 0;
      color: #1f2937;
      font-size: 16px;
    }
    .experience-item .company,
    .education-item .institution {
      color: #6b7280;
      font-size: 14px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 16px;
    }
    .stat-box {
      text-align: center;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .stat-box .value {
      font-size: 24px;
      font-weight: bold;
      color: #3b82f6;
    }
    .stat-box .label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${profile.displayName || profile.user.githubUsername}</h1>
    <div class="subtitle">@${profile.user.githubUsername}</div>
    ${profile.location ? `<div class="subtitle">${profile.location}</div>` : ''}
  </div>

  ${profile.bio ? `
  <div class="section">
    <h2>About</h2>
    <div class="bio">${profile.bio}</div>
  </div>
  ` : ''}

  ${options.includeGitHubStats && profile.user.githubStats[0] ? `
  <div class="section">
    <h2>GitHub Statistics</h2>
    <div class="stats">
      <div class="stat-box">
        <div class="value">${profile.user.githubStats[0].totalCommits || 0}</div>
        <div class="label">Commits</div>
      </div>
      <div class="stat-box">
        <div class="value">${profile.user.githubStats[0].totalPRs || 0}</div>
        <div class="label">Pull Requests</div>
      </div>
      <div class="stat-box">
        <div class="value">${profile.user.githubStats[0].totalStars || 0}</div>
        <div class="label">Stars</div>
      </div>
    </div>
  </div>
  ` : ''}

  ${options.includeSkills && profile.skills.length > 0 ? `
  <div class="section">
    <h2>Skills</h2>
    <div class="skills">
      ${profile.skills.map((s: any) => `<span class="skill-tag">${s.skill.name}</span>`).join('')}
    </div>
  </div>
  ` : ''}

  ${options.includeExperience && profile.workExperience.length > 0 ? `
  <div class="section">
    <h2>Work Experience</h2>
    ${profile.workExperience.map((exp: any) => `
      <div class="experience-item">
        <h3>${exp.position}</h3>
        <div class="company">${exp.company} • ${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}</div>
        ${exp.description ? `<p>${exp.description}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${options.includeEducation && profile.education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${profile.education.map((edu: any) => `
      <div class="education-item">
        <h3>${edu.degree}</h3>
        <div class="institution">${edu.institution} • ${edu.startDate} - ${edu.isCurrent ? 'Present' : edu.endDate}</div>
        ${edu.field ? `<p>${edu.field}</p>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="footer" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
    Generated from gitcaster.io/${profile.slug}
  </div>
</body>
</html>
  `
}

/**
 * Download PDF file
 */
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

