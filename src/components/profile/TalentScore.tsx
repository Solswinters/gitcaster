import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TalentProtocolScore } from '@/types';

interface TalentScoreProps {
  score: number | null;
  passportData?: TalentProtocolScore | null;
}

export function TalentScore({ score, passportData }: TalentScoreProps) {
  if (!score) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Talent Protocol Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No Talent Protocol data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Talent Protocol Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-blue-600">{score}</div>
            <p className="text-sm text-gray-500 mt-1">Builder Score</p>
          </div>
          {passportData && (
            <div className="text-right">
              {passportData.human_checkmark && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <span>✓</span>
                  <span>Verified Human</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {passportData && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-semibold">{passportData.activity_score || 0}</div>
              <p className="text-xs text-gray-500">Activity</p>
            </div>
            <div>
              <div className="text-2xl font-semibold">{passportData.identity_score || 0}</div>
              <p className="text-xs text-gray-500">Identity</p>
            </div>
            <div>
              <div className="text-2xl font-semibold">{passportData.skills_score || 0}</div>
              <p className="text-xs text-gray-500">Skills</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

