
'use server';
/**
 * @fileOverview Quantum Nest AI Engine - Recalibrated Mission Coordinator.
 * 
 * Implements strict routing for:
 * 1. Asteroids (NeoWs)
 * 2. Space Weather (DONKI)
 * 3. Daily Capture (NASA APOD - Strict Protocol)
 * 4. Explanations & Analysis (Anthropic Claude 3.5 Sonnet)
 * 5. Media Search (NASA Archives -> Pexels Fallback)
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const NASA_KEY = process.env.NASA_API_KEY || '';
const PEXELS_KEY = process.env.PEXELS_API_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

// ---------------- NASA: DAILY CAPTURE (APOD STRICT) ----------------
async function getDailyCapture() {
  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`);
    if (!res.ok) throw new Error("NASA APOD API unreachable");
    const data = await res.json();
    return {
      type: "daily_capture",
      title: data.title,
      date: data.date,
      explanation: data.explanation,
      image: data.url,
      media_type: data.media_type,
      success: true
    };
  } catch (e: any) {
    return {
      type: "daily_capture",
      success: false,
      error: "APOD data unavailable"
    };
  }
}

// ---------------- NASA: MEDIA ARCHIVE (Images, Audio, Video) ----------------
async function searchNASAMedia(query: string, mediaType: string = 'image') {
  try {
    const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=${mediaType}`);
    if (!res.ok) return [];
    const data = await res.json();
    const items = data?.collection?.items || [];
    
    return items.slice(0, 8).map((item: any) => ({
      title: item.data?.[0]?.title || "Space Artifact",
      image: item.links?.[0]?.href || null,
      description: item.data?.[0]?.description || "",
      nasaId: item.data?.[0]?.nasa_id,
      date: item.data?.[0]?.date_created
    }));
  } catch (e) {
    return [];
  }
}

// ---------------- NASA: ASTEROIDS (NeoWs) ----------------
async function getAsteroids() {
  const today = new Date().toISOString().split("T")[0];
  try {
    const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_KEY}`);
    const data = await res.json();
    const list = data?.near_earth_objects?.[today] || [];
    return list.slice(0, 6).map((a: any) => ({
      id: a.id,
      name: a.name,
      hazardous: a.is_potentially_hazardous_asteroid,
      speed: Math.round(parseFloat(a.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || "0")).toLocaleString() + " km/h",
      distance: Math.round(parseFloat(a.close_approach_data?.[0]?.miss_distance?.kilometers || "0")).toLocaleString() + " km",
      size: Math.round(a.estimated_diameter?.meters?.estimated_diameter_max || 0) + "m"
    }));
  } catch (e) {
    return [];
  }
}

// ---------------- NASA: SPACE WEATHER (DONKI) ----------------
async function getSpaceWeather() {
  try {
    const res = await fetch(`https://api.nasa.gov/DONKI/notifications?api_key=${NASA_KEY}`);
    const data = await res.json();
    return (data || []).slice(0, 5).map((e: any) => ({
      type: e.messageType,
      date: e.messageIssueTime,
      message: e.messageBody?.slice(0, 400) + "..."
    }));
  } catch (e) {
    return [];
  }
}

// ---------------- PEXELS: FALLBACK IMAGES ----------------
async function getPexels(query: string) {
  if (!PEXELS_KEY) return [];
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=6`, {
      headers: { Authorization: PEXELS_KEY }
    });
    const data = await res.json();
    return (data.photos || []).map((p: any) => ({
      title: p.alt || "Stellar Artifact",
      image: p.src?.medium,
      source: 'Pexels'
    }));
  } catch (e) {
    return [];
  }
}

// ---------------- ANTHROPIC: INTELLIGENCE SCAN ----------------
async function askAnthropic(question: string, context: string = 'general') {
  if (!ANTHROPIC_KEY) return "Intelligence archives offline. (Auth Protocol Required)";
  
  const systemPrompt = context === 'brief' 
    ? "You are the Quantum Nest cosmic assistant. Provide a single, extremely brief (2 sentences) scientific fact summary about the topic."
    : "You are the Quantum Nest cosmic assistant. Provide a detailed scientific overview including 3 key physical facts and an explanation of significance in 2-3 engaging paragraphs. Be specific and data-driven.";

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          { role: "user", content: question },
        ],
      }),
    });

    const data = await res.json();
    return data?.content?.[0]?.text || "Transmission interrupted.";
  } catch (e) {
    return "Intelligence retrieval failed.";
  }
}

// ---------------- MAIN AI ROUTER ----------------
export const cosmicSearch = ai.defineFlow(
  {
    name: "cosmicSearch",
    inputSchema: z.string(),
    outputSchema: z.any(),
  },
  async (query) => {
    const q = query.toLowerCase();
    let result: any = null;
    let info: string | null = null;
    let type = "unknown";

    // 🌌 1. ASTEROIDS
    if (q.includes("asteroid") || q.includes("neo") || q.includes("near earth")) {
      result = await getAsteroids();
      type = "asteroids";
      info = await askAnthropic(`Tell me about asteroids or current near-earth objects related to ${query}`, 'brief');
    }
    // 🌞 2. SPACE WEATHER
    else if (q.includes("solar") || q.includes("storm") || q.includes("flare") || q.includes("weather")) {
      result = await getSpaceWeather();
      type = "space_weather";
      info = await askAnthropic(`Explain current space weather trends or solar phenomena related to ${query}`, 'brief');
    }
    // 🌅 3. DAILY CAPTURE (APOD STRICT)
    else if (q.includes("apod") || q.includes("today") || q.includes("picture")) {
      result = await getDailyCapture();
      type = "daily_capture";
      return result;
    }
    // 🧠 4. EXPLANATION / QUESTIONS
    else if (
      q.includes("what is") || 
      q.includes("explain") || 
      q.includes("how") || 
      q.includes("why") || 
      q.includes("who") || 
      q.includes("describe") || 
      q.includes("tell me") || 
      q.includes("?")
    ) {
      result = await askAnthropic(query);
      type = "explanation";
    }
    // 🖼 5. MEDIA SEARCH (with AI Data)
    else {
      const isAudio = q.includes("sound") || q.includes("audio") || q.includes("listen");
      const isVideo = q.includes("video") || q.includes("movie") || q.includes("film");
      const mediaType = isAudio ? 'audio' : isVideo ? 'video' : 'image';

      const nasa = await searchNASAMedia(query, mediaType);
      
      if (nasa && nasa.length > 0) {
        result = nasa;
        type = isAudio ? "nasa_audio" : isVideo ? "nasa_video" : "nasa_images";
      } else {
        const pexels = await getPexels(query);
        result = pexels;
        type = "pexels_images";
      }

      info = await askAnthropic(`Describe and give scientific facts about ${query}`, 'general');
    }

    return {
      type,
      query,
      success: !!result,
      info: info, 
      data: result || [],
      count: Array.isArray(result) ? result.length : (result ? 1 : 0),
    };
  }
);
