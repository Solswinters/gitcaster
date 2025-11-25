import axios from 'axios'

import { TalentProtocolClient, getTalentProtocolScore } from '@/lib/talent-protocol/client'
import { mockTalentScore } from '../../../utils/mock-data'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('TalentProtocolClient', () => {
  let client: TalentProtocolClient
  const mockApiKey = 'mock-talent-api-key'
  const mockWalletAddress = '0x1234567890abcdef1234567890abcdef12345678'

  beforeEach(() => {
    client = new TalentProtocolClient(mockApiKey)
    jest.clearAllMocks()
  })

  describe('getPassportByWallet', () => {
    it('should fetch passport data successfully', async () => {
      const mockResponse = { passport: mockTalentScore }
      mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: mockResponse })

      const result = await client.getPassportByWallet(mockWalletAddress)

      expect(result).toEqual(mockTalentScore)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api.talentprotocol.com/api/v2/passports/${mockWalletAddress.toLowerCase()}`,
        expect.objectContaining({
          headers: {
            'X-API-KEY': mockApiKey,
          },
        })
      )
    })

    it('should convert wallet address to lowercase', async () => {
      const upperCaseAddress = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12'
      const mockResponse = { passport: mockTalentScore }
      mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: mockResponse })

      await client.getPassportByWallet(upperCaseAddress)

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(upperCaseAddress.toLowerCase()),
        expect.any(Object)
      )
    })

    it('should return null when passport not found (404)', async () => {
      mockedAxios.get = jest.fn().mockRejectedValueOnce({
        response: { status: 404 },
      })

      const result = await client.getPassportByWallet(mockWalletAddress)

      expect(result).toBeNull()
    })

    it('should return null on other errors', async () => {
      mockedAxios.get = jest.fn().mockRejectedValueOnce({
        response: { status: 500, data: { message: 'Server Error' } },
      })

      const result = await client.getPassportByWallet(mockWalletAddress)

      expect(result).toBeNull()
    })
  })

  describe('getBuilderScore', () => {
    it('should return builder score when passport exists', async () => {
      const mockResponse = { passport: mockTalentScore }
      mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: mockResponse })

      const result = await client.getBuilderScore(mockWalletAddress)

      expect(result).toBe(mockTalentScore.score)
    })

    it('should return null when passport not found', async () => {
      mockedAxios.get = jest.fn().mockRejectedValueOnce({
        response: { status: 404 },
      })

      const result = await client.getBuilderScore(mockWalletAddress)

      expect(result).toBeNull()
    })

    it('should return null when score is missing', async () => {
      const mockResponse = { passport: { ...mockTalentScore, score: undefined } }
      mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: mockResponse })

      const result = await client.getBuilderScore(mockWalletAddress)

      expect(result).toBeNull()
    })
  })
})

describe('getTalentProtocolScore', () => {
  const mockWalletAddress = '0x1234567890abcdef1234567890abcdef12345678'
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should fetch talent protocol score successfully', async () => {
    process.env.TALENT_PROTOCOL_API_KEY = 'test-api-key'
    const mockResponse = { passport: mockTalentScore }
    mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: mockResponse })

    const result = await getTalentProtocolScore(mockWalletAddress)

    expect(result).toEqual(mockTalentScore)
  })

  it('should return null when API key is not set', async () => {
    delete process.env.TALENT_PROTOCOL_API_KEY

    const result = await getTalentProtocolScore(mockWalletAddress)

    expect(result).toBeNull()
  })

  it('should handle API errors gracefully', async () => {
    process.env.TALENT_PROTOCOL_API_KEY = 'test-api-key'
    mockedAxios.get = jest.fn().mockRejectedValueOnce({
      response: { status: 500 },
    })

    const result = await getTalentProtocolScore(mockWalletAddress)

    expect(result).toBeNull()
  })
})

