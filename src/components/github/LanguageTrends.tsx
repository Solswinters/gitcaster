'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface LanguageData {
  name: string
  value: number
  color: string
}

interface LanguageTrendsProps {
  languages: Record<string, number>
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#777bb4',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Swift: '#ffac45',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  React: '#61dafb',
  Svelte: '#ff3e00',
}

export function LanguageTrends({ languages }: LanguageTrendsProps) {
  const total = Object.values(languages).reduce((sum, val) => sum + val, 0)

  const data: LanguageData[] = Object.entries(languages)
    .map(([name, value]) => ({
      name,
      value,
      color: LANGUAGE_COLORS[name] || `#${Math.floor(Math.random()*16777215).toString(16)}`,
      percentage: ((value / total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8) // Top 8 languages

  const topLanguages = data.slice(0, 5)
  const otherLanguages = data.slice(5)
  const otherTotal = otherLanguages.reduce((sum, lang) => sum + lang.value, 0)

  const chartData = [
    ...topLanguages,
    ...(otherLanguages.length > 0 ? [{
      name: 'Other',
      value: otherTotal,
      color: '#94a3b8',
      percentage: ((otherTotal / total) * 100).toFixed(1),
    }] : [])
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${((value / total) * 100).toFixed(1)}%`}
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Language List */}
        <div className="space-y-3">
          {data.map((lang, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-medium">{lang.name}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {(lang as any).percentage}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(lang as any).percentage}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

