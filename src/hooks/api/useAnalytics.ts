import { useEffect, useState } from 'react'

export function useMetrics(userId?: string, includeBenchmarks?: boolean) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)
        if (includeBenchmarks) params.append('includeBenchmarks', 'true')

        const response = await fetch(`/api/analytics/metrics?${params}`)
        const json = await response.json()

        if (json.error) throw new Error(json.error)
        setData(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [userId, includeBenchmarks])

  return { data, loading, error }
}

export function useCareerData(userId?: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCareer() {
      try {
        const params = new URLSearchParams()
        if (userId) params.append('userId', userId)

        const response = await fetch(`/api/analytics/career?${params}`)
        const json = await response.json()

        if (json.error) throw new Error(json.error)
        setData(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCareer()
  }, [userId])

  return { data, loading, error }
}

export function usePredictions(type: 'growth' | 'career' = 'growth') {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const response = await fetch(`/api/analytics/predict?type=${type}`)
        const json = await response.json()

        if (json.error) throw new Error(json.error)
        setData(json)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
  }, [type])

  return { data, loading, error }
}

