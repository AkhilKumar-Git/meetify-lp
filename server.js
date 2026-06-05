const express = require('express');
const cors = require('cors');

// Dynamically check for global native fetch or require node-fetch
let fetchLib = global.fetch;
if (!fetchLib) {
  try {
    fetchLib = require('node-fetch');
  } catch (e) {
    console.warn("Warning: Native fetch not found. Please ensure Node.js v18+ is used or run 'npm install node-fetch'.");
  }
}

const app = express();
const PORT = 8123;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Serve Meetify static assets (HTML/CSS/JS)

// Proxy for Firecrawl Scrape
app.post('/api/scrape', async (req, res) => {
  try {
    const { url, key } = req.body;
    if (!fetchLib) {
      return res.status(500).json({ error: "Fetch library not initialized on server. Run 'npm install node-fetch'." });
    }
    
    console.log(`[Proxy] Sending scrape request to Firecrawl for: ${url}`);
    
    const response = await fetchLib('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        url,
        formats: ['markdown']
      })
    });
    
    const data = await response.json();
    console.log(`[Proxy] Scrape status: ${response.status}`);
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`[Proxy] Scrape Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy for OpenAI Analyze
app.post('/api/analyze', async (req, res) => {
  try {
    const { markdown, promptFocus, key } = req.body;
    if (!fetchLib) {
      return res.status(500).json({ error: "Fetch library not initialized on server. Run 'npm install node-fetch'." });
    }

    console.log(`[Proxy] Sending analysis request to OpenAI (Focus: ${promptFocus})`);
    
    let systemInstructions = "";
    if (promptFocus === "swot") {
      systemInstructions = "You are a professional competitive intelligence analyst. Perform a thorough SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis of the competitor business model based on the following website content. Format using bold titles, clear subheadings, and crisp bullet lists.";
    } else if (promptFocus === "pricing") {
      systemInstructions = "You are a pricing strategy expert. Perform a structured Pricing Model & Luxury Tier analysis based on the competitor's website content. Detail base values, premium option margins, packages, and luxury marketing upsells.";
    } else if (promptFocus === "features") {
      systemInstructions = "You are a product spec matrix designer. Build a structured technical feature and product specification matrix summarizing key chassis, engine, and cabin systems from the competitor's website content.";
    } else {
      systemInstructions = "You are a growth marketing director. Outline the target consumer persona, brand positioning, marketing channels, and core value propositions based on the competitor's website content.";
    }

    const response = await fetchLib("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstructions },
          { role: "user", content: `Competitor Web Page Markdown Content:\n\n${markdown}` }
        ],
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    console.log(`[Proxy] OpenAI analysis status: ${response.status}`);
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`[Proxy] OpenAI Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`Meetify Server is running at http://localhost:${PORT}`);
  console.log(`Serving UI static directory and secure reverse-proxies.`);
  console.log(`==================================================\n`);
});
