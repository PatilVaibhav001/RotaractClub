const Event = require('../models/Event');
const axios = require('axios');
const ImageKit = require('imagekit');

const generateAiAnalysis = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const prompt = `
I NEED 3 OUTPUTS FROM GEMINI based on the following event data:
Event Name: ${event.name}
Category: ${event.category}
Date: ${event.date}
Location: ${event.location}
Volunteers: ${event.volunteers}
Beneficiaries: ${event.beneficiaries}
Description: ${event.description}

OUTPUT 1 — AI Report
Generate a formal Rotaract project report with these sections:
1. Project Overview
2. Objectives
3. Activities Conducted
4. Impact Summary
5. Conclusion
Return as plain text.

OUTPUT 2 — Social Media Captions
Generate platform specific captions using the project data.
Return as JSON:
{
  "instagram": "caption with emojis and hashtags #Rotaract #RCPH #RID3131",
  "linkedin": "professional caption no emojis max 100 words",
  "whatsapp": "short friendly message max 50 words",
  "twitter": "under 280 characters with 2-3 hashtags"
}
Return ONLY JSON, no extra text.

OUTPUT 3 — Impact Analysis
Analyze the project impact and return ONLY this JSON:
{
  "impactScore": 85,
  "rating": "High Impact",
  "communityReach": "estimated people reached beyond direct beneficiaries",
  "sdgMapped": [
    { "sdg": 4, "name": "Quality Education", "reason": "brief reason" }
  ],
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["suggestion 1", "suggestion 2"],
  "summary": "2 line impact summary"
}
Return ONLY JSON, no extra text.

VERY IMPORTANT INSTRUCTION: 
You MUST format your response exactly as follows:

===OUTPUT 1===
(your text here)
===OUTPUT 2===
(your json here)
===OUTPUT 3===
(your json here)
`;

    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    const rawText = response.data.candidates[0].content.parts[0].text;

    // Parse the outputs
    const output1Match = rawText.split('===OUTPUT 1===')[1]?.split('===OUTPUT 2===')[0]?.trim();
    const output2Match = rawText.split('===OUTPUT 2===')[1]?.split('===OUTPUT 3===')[0]?.trim();
    const output3Match = rawText.split('===OUTPUT 3===')[1]?.trim();

    const cleanJson = (str) => {
        if (!str) return null;
        let s = str.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(s);
    };

    let socialCaptions = null;
    let impactAnalysis = null;

    try {
        socialCaptions = cleanJson(output2Match);
    } catch(e) { console.error("Failed to parse output 2", e); }
    
    try {
        impactAnalysis = cleanJson(output3Match);
    } catch(e) { console.error("Failed to parse output 3", e); }

    event.aiReport = output1Match || "AI Report could not be generated.";
    event.socialCaptions = socialCaptions || {};
    event.impactAnalysis = impactAnalysis || {};

    await event.save();
    
    const populatedEvent = await Event.findById(event._id).populate('author', 'name email club');
    res.json(populatedEvent);
  } catch (error) {
    console.error('Error generating AI analysis:', error?.response?.data || error);
    res.status(500).json({ message: 'Server error generating AI analysis', error: error?.response?.data || error.message });
  }
};

const generateAiPoster = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const promptStr = `A highly professional, cinematic, and gorgeous social media poster for a Rotaract club community event. Category: ${event.category}. Title: ${event.name}. Location: ${event.location}. Clean vector art style, abstract shapes, vibrant colors, highly detailed. NO TEXT, NO WORDS.`;

    const form = new FormData();
    form.append('prompt', promptStr);

    const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY
      },
      body: form
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Clipdrop API error: ${err}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    const uploadRes = await imagekit.upload({
      file: buffer,
      fileName: `poster-${Date.now()}.png`
    });

    event.aiPoster = uploadRes.url;
    await event.save();

    const populatedEvent = await Event.findById(event._id).populate('author', 'name email club');
    res.json(populatedEvent);
  } catch (error) {
    console.error('Error generating poster:', error);
    res.status(500).json({ message: 'Server error generating poster', error: error.message });
  }
};

module.exports = { generateAiAnalysis, generateAiPoster };
