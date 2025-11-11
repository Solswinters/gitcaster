import axios from 'axios';
import { TalentProtocolScore } from '@/types';

const TALENT_PROTOCOL_API_BASE = 'https://api.talentprotocol.com/api/v2';

export class TalentProtocolClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string): Promise<T | null> {
    try {
      const response = await axios.get(`${TALENT_PROTOCOL_API_BASE}${endpoint}`, {
        headers: {
          'X-API-KEY': this.apiKey,
        },
      });
      return response.data;
    } catch (error: any) {
      // If resource not found (404), return null - this is expected for users without a passport
      if (error.response?.status === 404) {
        console.log(`Talent Protocol: No passport found (${endpoint})`);
        return null;
      }
      
      // For other errors, throw
      console.error(`Talent Protocol API Error (${endpoint}):`, error.response?.data || error.message);
      throw new Error(`Failed to fetch ${endpoint}: ${error.response?.data?.message || error.message}`);
    }
  }

  async getPassportByWallet(walletAddress: string): Promise<TalentProtocolScore | null> {
    try {
      const response = await this.request<{ passport: TalentProtocolScore }>(
        `/passports/${walletAddress.toLowerCase()}`
      );
      return response?.passport || null;
    } catch (error) {
      console.error('Error fetching Talent Protocol passport:', error);
      return null;
    }
  }

  async getBuilderScore(walletAddress: string): Promise<number | null> {
    try {
      const passport = await this.getPassportByWallet(walletAddress);
      return passport?.score || null;
    } catch (error) {
      console.error('Error fetching builder score:', error);
      return null;
    }
  }
}

export async function getTalentProtocolScore(walletAddress: string): Promise<TalentProtocolScore | null> {
  const apiKey = process.env.TALENT_PROTOCOL_API_KEY;
  
  if (!apiKey) {
    console.error('TALENT_PROTOCOL_API_KEY is not set');
    return null;
  }

  const client = new TalentProtocolClient(apiKey);
  return client.getPassportByWallet(walletAddress);
}

