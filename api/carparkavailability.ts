import type { Request, Response } from 'express';

const LTA_DATAMALL_ENDPOINT = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

export interface LTACarparkItem {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // format: "latitude longitude" e.g. "1.29375 103.85718"
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y'; // C: Cars, H: Heavy Vehicles, Y: Motorcycles
  Agency: 'HDB' | 'LTA' | 'URA';
}

export interface LTAResponse {
  'odata.metadata'?: string;
  value: LTACarparkItem[];
}

/**
 * Serverless / Express handler for LTA DataMall CarParkAvailabilityv2
 * Path: /api/carparkavailability
 */
export default async function handler(req: Request | any, res: Response | any) {
  // Set CORS headers
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');
  }

  if (req.method === 'OPTIONS') {
    return res.status ? res.status(200).end() : new Response(null, { status: 200 });
  }

  // Retrieve LTA AccountKey from environment variable (do not hardcode)
  const accountKey = process.env.LTA_ACCOUNT_KEY || process.env.ACCOUNT_KEY;

  if (!accountKey) {
    const errorPayload = {
      success: false,
      configured: false,
      error: 'MISSING_LTA_ACCOUNT_KEY',
      message:
        'LTA_ACCOUNT_KEY environment variable is not configured. Set LTA_ACCOUNT_KEY in your environment or Secrets.',
      endpoint: LTA_DATAMALL_ENDPOINT,
      registrationUrl: 'https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html',
      headerRequired: 'AccountKey: <LTA_ACCOUNT_KEY>',
      value: [],
    };

    if (res.status && res.json) {
      return res.status(200).json(errorPayload);
    }
    return new Response(JSON.stringify(errorPayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse optional $skip query parameter for pagination (LTA returns 500 records per page)
    const query = req.query || {};
    const skip = query['$skip'] || query['skip'];
    const fetchAll = query['all'] === 'true' || query['all'] === '1';

    if (fetchAll) {
      // Fetch and aggregate all pages (LTA limits to 500 per call)
      let allLots: LTACarparkItem[] = [];
      let currentSkip = 0;
      let hasMore = true;

      while (hasMore && currentSkip < 2500) {
        const url = `${LTA_DATAMALL_ENDPOINT}?$skip=${currentSkip}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            AccountKey: accountKey.trim(),
            accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`LTA DataMall API responded with HTTP ${response.status}: ${response.statusText}`);
        }

        const data: LTAResponse = await response.json();
        const records = data.value || [];
        allLots = allLots.concat(records);

        if (records.length < 500) {
          hasMore = false;
        } else {
          currentSkip += 500;
        }
      }

      const responsePayload = {
        success: true,
        configured: true,
        count: allLots.length,
        timestamp: new Date().toISOString(),
        source: 'LTA DataMall CarParkAvailabilityv2 (Aggregated)',
        value: allLots,
      };

      if (res.status && res.json) {
        res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
        return res.status(200).json(responsePayload);
      }
      return new Response(JSON.stringify(responsePayload), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      });
    }

    // Single page fetch
    const targetUrl = skip ? `${LTA_DATAMALL_ENDPOINT}?$skip=${skip}` : LTA_DATAMALL_ENDPOINT;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey.trim(),
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      const status = response.status;
      const errorPayload = {
        success: false,
        configured: true,
        status,
        error: `LTA DataMall returned status ${status}`,
        details: errText,
        endpoint: targetUrl,
      };

      if (res.status && res.json) {
        return res.status(status).json(errorPayload);
      }
      return new Response(JSON.stringify(errorPayload), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data: LTAResponse = await response.json();
    const responsePayload = {
      success: true,
      configured: true,
      count: data.value ? data.value.length : 0,
      timestamp: new Date().toISOString(),
      source: 'LTA DataMall CarParkAvailabilityv2',
      'odata.metadata': data['odata.metadata'],
      value: data.value || [],
    };

    if (res.status && res.json) {
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
      return res.status(200).json(responsePayload);
    }
    return new Response(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err: any) {
    const errorPayload = {
      success: false,
      configured: true,
      error: 'FETCH_ERROR',
      message: err.message || 'Failed to connect to LTA DataMall',
      endpoint: LTA_DATAMALL_ENDPOINT,
    };

    if (res.status && res.json) {
      return res.status(502).json(errorPayload);
    }
    return new Response(JSON.stringify(errorPayload), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
