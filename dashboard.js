// --- DASHBOARD INTERACTIVITY LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  initProfileDropdown();
  initRowClicks();
  initTabSwitcher();
  initIntelligenceModule();
});

// --- LIVE TABLE SEARCH ---
function initSearch() {
  const searchInput = document.getElementById("dashboard-search");
  const tableRows = document.querySelectorAll("#meetingsTableBody tr");

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();

    tableRows.forEach(row => {
      // Get text content of all cells in the row
      const cellsText = Array.from(row.getElementsByTagName("td"))
        .map(cell => cell.textContent.toLowerCase())
        .join(" ");

      if (cellsText.includes(query)) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });
}

// --- PROFILE DROPDOWN TOGGLE ---
function initProfileDropdown() {
  const profileTrigger = document.getElementById("profileTrigger");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (!profileTrigger || !dropdownMenu) return;

  profileTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("open");
  });

  // Close when clicking anywhere else
  document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== profileTrigger) {
      dropdownMenu.classList.remove("open");
    }
  });

  // Handle escape key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdownMenu.classList.remove("open");
    }
  });
}

// --- PLAYABLE ROW ACTION ---
function initRowClicks() {
  const playableRows = document.querySelectorAll(".playable-row");

  playableRows.forEach(row => {
    row.addEventListener("click", () => {
      const playlistId = row.dataset.playlist;
      if (playlistId) {
        // Redirect to index.html and pass the playlist id parameter
        window.location.href = `index.html?playlist=${playlistId}`;
      }
    });
  });
}

// --- TAB SWITCHER LOGIC ---
function initTabSwitcher() {
  const tabDashboard = document.getElementById("tabDashboard");
  const tabIntelligence = document.getElementById("tabIntelligence");
  const dashboardView = document.getElementById("dashboardViewContainer");
  const intelligenceView = document.getElementById("intelligenceViewContainer");

  if (!tabDashboard || !tabIntelligence || !dashboardView || !intelligenceView) return;

  tabDashboard.addEventListener("click", (e) => {
    e.preventDefault();
    tabDashboard.classList.add("active");
    tabIntelligence.classList.remove("active");
    dashboardView.style.display = "block";
    intelligenceView.style.display = "none";
  });

  tabIntelligence.addEventListener("click", (e) => {
    e.preventDefault();
    tabIntelligence.classList.add("active");
    tabDashboard.classList.remove("active");
    dashboardView.style.display = "none";
    intelligenceView.style.display = "block";
  });
}

// --- COMPETITIVE INTELLIGENCE MODULE LOGIC ---
function initIntelligenceModule() {
  // Toggle password keys visibility
  const toggleButtons = document.querySelectorAll(".btn-toggle-password");
  toggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
      } else {
        input.type = "password";
        btn.textContent = "👁️";
      }
    });
  });

  // Action Buttons
  const btnRunReal = document.getElementById("btnRunRealIntel");
  const btnRunMock = document.getElementById("btnRunMockIntel");
  const btnCopyMarkdown = document.getElementById("btnCopyMarkdown");

  // Output Elements
  const loader = document.getElementById("intelLoader");
  const loaderStatus = document.getElementById("intelLoaderStatus");
  const resultsGrid = document.getElementById("intelResults");
  const markdownOutput = document.getElementById("markdownOutput");
  const markdownLength = document.getElementById("markdownLength");
  const insightsOutput = document.getElementById("insightsOutput");

  if (btnRunMock) {
    btnRunMock.addEventListener("click", () => runMockSimulation());
  }

  if (btnRunReal) {
    btnRunReal.addEventListener("click", () => runRealAnalysis());
  }

  if (btnCopyMarkdown) {
    btnCopyMarkdown.addEventListener("click", () => {
      const markdownText = markdownOutput.textContent;
      navigator.clipboard.writeText(markdownText).then(() => {
        const originalText = btnCopyMarkdown.textContent;
        btnCopyMarkdown.textContent = "Copied!";
        btnCopyMarkdown.disabled = true;
        setTimeout(() => {
          btnCopyMarkdown.textContent = originalText;
          btnCopyMarkdown.disabled = false;
        }, 1500);
      });
    });
  }

  // --- MOCK SIMULATION ACTION ---
  function runMockSimulation() {
    loader.style.display = "flex";
    resultsGrid.style.display = "none";
    
    const steps = [
      { delay: 0, text: "🔗 Initializing connection to Firecrawl Scraper API (api.firecrawl.dev)..." },
      { delay: 1200, text: "🔄 Extracting HTML content of luxury car product catalog..." },
      { delay: 2400, text: "📝 Parsing web DOM trees and converting tags to clean markdown..." },
      { delay: 3600, text: "✨ Successfully scraped 4,180 characters of product specification content." },
      { delay: 4800, text: "🧠 Dispatching markdown data to OpenAI GPT-4o intelligence engine..." },
      { delay: 6000, text: "📊 Generating competitive positioning grids and structured summaries..." },
      { delay: 7200, text: "🎉 Strategic analysis successfully updated!" }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        loaderStatus.textContent = step.text;
      }, step.delay);
    });

    setTimeout(() => {
      loader.style.display = "none";
      resultsGrid.style.display = "grid";
      
      const promptFocus = document.getElementById("intelPromptSelect").value;
      const mockScrapedMarkdown = `# Porsche 911 Carrera Models - Catalog & Spec Sheet
The Porsche 911 is the definitive luxury sports car segment benchmark.
- **Model Base Price**: $120,100 USD
- **Layout**: Rear-engine, RWD or AWD configuration
- **Chassis**: Lightweight steel-aluminum hybrid chassis
- **Power output**: 3.0-liter twin-turbocharged boxer 6 engine generating 379 hp
- **Transmission**: 8-speed Porsche Doppelkupplung (PDK) automatic
- **Aesthetic focus**: Sleek LED headlights, integrated active rear spoiler wing, premium full-grain leather cabin cockpit interface.`;

      let mockAiAnalysisText = "";

      if (promptFocus === "swot") {
        mockAiAnalysisText = `### SWOT Analysis: Porsche 911 Carrera Positioning

**Strengths (S)**
- **Market Benchmark**: Retains the legacy title of the premium everyday high-performance sports car.
- **High Retention Value**: Standard resale value remains extremely resilient, driving customer loyalty.
- **Engineering Quality**: Legendary rear-engine flat-six mechanical durability and PASM active dampers.

**Weaknesses (W)**
- **Steep Base Pricing**: Baseline pricing starts at $120k, but typical dealer inventory contains $25k+ in factory options.
- **Limited Cabin Utility**: The 2+2 layout has extremely restricted rear seating spaces, serving mostly as secondary luggage space.

**Opportunities (O)**
- **Hybrid Performance Integration**: The upcoming T-Hybrid powertrains capture tech-centric luxury sports car consumers.
- **Configure-to-Order Digital Experience**: Expanding virtual configurator features to accelerate direct online deposits.

**Threats (T)**
- **Electric Performance Challengers**: The entry of electric sports coupés (e.g. Porsche Taycan variants, Lotus Emeya, and high-performance Tesla models) threatening ICE performance vehicle demand.`;
      } else if (promptFocus === "pricing") {
        mockAiAnalysisText = `### Pricing Model & Luxury Tier Analysis

- **Entry Luxury Tier (Base Carrera)**: $120,100 - $130,000 USD. Captures younger high-income professionals and brand enthusiasts.
- **High Margin Enthusiast Tier (Carrera GTS / S)**: $140,000 - $165,000 USD. Employs high-margin suspension packages and performance options to secure high operational profits.
- **Halo Supercar Tier (GT3 RS / Turbo S)**: $200,000 - $290,000+ USD. Aimed at ultra-high-net-worth collectors and track hobbyists. Underlines the brand's premium engineering heritage.
- **Upselling Model Strategy**: Highly modular pricing where minor updates (leather dashboard trims, paint-to-sample, sport chrono dials) add $20,000 to $40,000 to the average transaction value.`;
      } else if (promptFocus === "features") {
        mockAiAnalysisText = `### Product Features & Specs Matrix

- **Engine Layout**: 3.0L twin-turbocharged boxer 6 cylinder, water-cooled with direct fuel injection.
- **Chassis Management**: Standard Porsche Active Suspension Management (PASM) with electronic damping controllers.
- **Exhaust & Sound**: Variable butterfly sport exhaust valve systems to tailor signature flat-six frequencies.
- **Cockpit Systems**: 10.9-inch center high-definition infotainment integrated with mechanical instrument cluster elements (analog tachometer).`;
      } else {
        mockAiAnalysisText = `### Marketing Strategy & Key Value Props

- **Key Value Proposition**: "The Timeless Machine" — balancing 60 years of heritage with high-tech daily drivability.
- **Core Marketing Channels**:
  - Exclusive track programs (Porsche Experience Center Atlanta/LA).
  - High-engagement digital configure-to-order visualizers.
  - Classic racing programs (Mobil 1 Supercup, Le Mans racing).
- **Target Persona**: Wealthy professionals aged 38-65 valuing mechanical feedback, performance control, and iconic design consistency.`;
      }

      markdownOutput.textContent = mockScrapedMarkdown;
      markdownLength.textContent = `${mockScrapedMarkdown.length} characters`;
      insightsOutput.innerHTML = renderMarkdownToHtml(mockAiAnalysisText);
    }, 7300);
  }

  // --- REAL-TIME API INTELLIGENCE ACTION ---
  async function runRealAnalysis() {
    const targetUrl = document.getElementById("scrapeUrl").value.trim();
    const firecrawlKey = document.getElementById("firecrawlKey").value.trim();
    const openaiKey = document.getElementById("openaiKey").value.trim();
    const promptFocus = document.getElementById("intelPromptSelect").value;

    if (!targetUrl) {
      alert("Please enter a valid target URL to scrape.");
      return;
    }

    if (!firecrawlKey || !openaiKey) {
      alert("Please provide both your Firecrawl API Key and OpenAI API Key to run real analysis, or click 'Try Demo Simulation' for a preview.");
      return;
    }

    loader.style.display = "flex";
    resultsGrid.style.display = "none";
    
    let extractedMarkdown = "";
    let useProxy = true;

    try {
      // Step 1: Scrape Website via Firecrawl (Try local backend proxy first to bypass CORS)
      loaderStatus.textContent = "Connecting to Firecrawl Scraper via local proxy...";
      
      let firecrawlResponse;
      try {
        firecrawlResponse = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl, key: firecrawlKey })
        });

        if (!firecrawlResponse.ok && firecrawlResponse.status === 404) {
          throw new Error("Proxy routes not found. Falling back to direct API call...");
        }
      } catch (e) {
        console.warn("Local proxy scrape failed. Falling back to direct fetch...", e);
        useProxy = false;
        loaderStatus.textContent = "CORS Warning: Proxy offline. Scraping directly via browser...";
        
        firecrawlResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${firecrawlKey}`
          },
          body: JSON.stringify({
            url: targetUrl,
            formats: ["markdown"]
          })
        });
      }

      if (!firecrawlResponse.ok) {
        const errorText = await firecrawlResponse.text();
        throw new Error(`Scrape request failed with status ${firecrawlResponse.status}: ${errorText}`);
      }

      const firecrawlData = await firecrawlResponse.json();
      
      if (!firecrawlData.success || !firecrawlData.data || !firecrawlData.data.markdown) {
        throw new Error("Invalid response or empty content from Scraper. Try again with a different URL.");
      }

      extractedMarkdown = firecrawlData.data.markdown;
      markdownOutput.textContent = extractedMarkdown;
      markdownLength.textContent = `${extractedMarkdown.length} characters`;

      // Step 2: OpenAI Chat Completions Analysis
      loaderStatus.textContent = "Scraped successfully! Running OpenAI GPT-4o analysis...";
      
      let aiReply = "";
      if (useProxy) {
        const openaiResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            markdown: extractedMarkdown,
            promptFocus: promptFocus,
            key: openaiKey
          })
        });

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          throw new Error(`OpenAI analysis via proxy failed with status ${openaiResponse.status}: ${errorText}`);
        }

        const openaiData = await openaiResponse.json();
        aiReply = openaiData.choices[0].message.content;
        document.getElementById("intelBadgeStatus").textContent = "Processed via Proxy (GPT-4o)";
      } else {
        // Direct browser fallback (subject to CORS policies on api.openai.com)
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

        const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemInstructions },
              { role: "user", content: `Competitor Web Page Markdown Content:\n\n${extractedMarkdown}` }
            ],
            temperature: 0.7
          })
        });

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          throw new Error(`Direct OpenAI API request failed with status ${openaiResponse.status}: ${errorText}`);
        }

        const openaiData = await openaiResponse.json();
        aiReply = openaiData.choices[0].message.content;
        document.getElementById("intelBadgeStatus").textContent = "Processed Direct (CORS-restricted)";
      }

      insightsOutput.innerHTML = renderMarkdownToHtml(aiReply);
      loader.style.display = "none";
      resultsGrid.style.display = "grid";

    } catch (err) {
      console.error(err);
      loaderStatus.innerHTML = `<span style="color: var(--accent-magenta);">❌ Error: ${err.message}</span><br><br><small style="color: var(--text-muted); font-size: 12px; display: block; margin-top: 10px;">If you see a CORS/Blocked error, please install dependencies and run the proxy backend:<br><code style="background: rgba(0,0,0,0.4); padding: 4px 8px; border-radius: 4px; color: var(--primary); display: inline-block; margin-top: 6px; font-family: monospace;">npm install && npm start</code></small>`;
    }
  }
}

// --- LIGHTWEIGHT MARKDOWN TO HTML CONVERTER ---
function renderMarkdownToHtml(markdown) {
  if (!markdown) return "";
  let html = markdown;
  
  // Replace headers: ### Header or ## Header
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h3>$1</h3>");
  
  // Replace bold text: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Parse simple lists
  const lines = html.split("\n");
  let inList = false;
  const processedLines = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        processedLines.push("<ul>");
        inList = true;
      }
      processedLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push("</ul>");
        inList = false;
      }
      processedLines.push(line);
    }
  });
  
  if (inList) {
    processedLines.push("</ul>");
  }
  
  return processedLines.join("\n");
}
