import type { Request, Response } from 'express';

interface HealthResponse {
  status: 'ok' | 'error';
  service: string;
  timestamp: string;
  ltaKeyConfigured: boolean;
  endpoint: string;
  uptimeSeconds: number;
}

/**
 * Serverless / Express health check handler
 * Path: /api/health
 */
export default async function handler(req: Request | any, res: Response | any) {
  // Support CORS
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');
  }

  if (req.method === 'OPTIONS') {
    return res.status ? res.status(200).end() : new Response(null, { status: 200 });
  }

  const isConfigured = Boolean(process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY);

  const payload: HealthResponse = {
    status: 'ok',
    service: 'LTA DataMall CarParkAvailabilityv2 Gateway',
    timestamp: new Date().toISOString(),
    ltaKeyConfigured: isConfigured,
    endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
  };

  if (res.status && res.json) {
    return res.status(200).json(payload);
  }

  // Fallback for Fetch/Edge runtime
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
