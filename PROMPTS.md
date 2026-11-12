# Project Prompts Log

This document records all user prompts provided during the development of the **SG ParkLive** application, documenting the requirements and iteration history.

---

## Prompt 1: Initial Application Build

**Timestamp:** 2026-11-12T01:11:13-08:00

```text
build a singapore based carpark application that tracks real time carpark lots availability. build just the frontend for now, I will integrate the backend later.
```

### Implementation Summary:
* Created **SG ParkLive** frontend application with interactive Leaflet map and high-contrast Singapore geographic layers.
* Direct client-side integration with official Singapore government real-time data (`https://api.data.gov.sg/v1/transport/carpark-availability`).
* Curated comprehensive carpark catalog across HDB MSCPs, URA, and major shopping destinations (Marina Bay Sands, Suntec City, ION Orchard, Bugis Junction, VivoCity, Tampines Mall, Jurong East Gateway, Causeway Point, Jewel Changi Airport).
* Implemented real-time lot availability indicators, color-coded availability markers (Green / Amber / Red / Slate), 24-hour occupancy pattern predictions, search and filtering tools (Region, Vehicle type, Sunday Free Parking), Destination Parking Finder, and driver Favorites persistence.

---

## Prompt 2: GitHub Repository Push

**Timestamp:** 2026-11-12T01:18:17-08:00

```text
git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@github.com/samlum91/cargowhere.git
```
*(Note: Personal access token redacted for security)*

### Implementation Summary:
* Initialized Git repository, configured Git user credentials (`samlum91` / `samuellum@gmail.com`).
* Created initial commit (`3e25135`) containing all components, styles, configurations, and assets.
* Pushed main branch to `https://github.com/samlum91/cargowhere.git`.
* Cleared authentication token from `.git/config` remote URL to ensure secret security.

---

## Prompt 3: Serverless LTA DataMall Gateway

**Timestamp:** 2026-11-12T01:38:47-08:00

```text
1. add a serverless connection that pulls live data from LTA's datamall using the following endpoint: 

# Live carpark lots (HDB, LTA and URA):
https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2

# Every request needs the header:  AccountKey: <LTA_ACCOUNT_KEY>

2. store this in /api folder at project root level (not the src file)

3. Include /health.ts and /carparkavailability.ts within the same sub folder 

4. do not hardcode any key, I will input them later
```

### Implementation Summary:
* Created `/api/carparkavailability.ts` at the project root level to connect to LTA DataMall's `CarParkAvailabilityv2` API using `AccountKey: <LTA_ACCOUNT_KEY>` header.
* Zero hardcoding: dynamically reads from `process.env.LTA_ACCOUNT_KEY` and provides informative status response when unconfigured.
* Created `/api/health.ts` for gateway health checks and verification of LTA key configuration.
* Added `server.ts` to host both `/api/*` serverless routes alongside Vite in dev/production environments.
* Updated `.env.example` with `LTA_ACCOUNT_KEY=""`.
* Committed and pushed updates to `main` on GitHub.

---

## Prompt 4: Prompts Documentation

**Timestamp:** 2026-11-12T01:47:22-08:00

```text
collate all of the prompts and store them as a PROMPTS.md file
```

### Implementation Summary:
* Generated this comprehensive `PROMPTS.md` file archiving all instructions, timestamps, and architectural outcomes.
