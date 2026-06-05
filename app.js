// --- MOCK DATABASE ---
const PLAYLISTS_DATA = [
  {
    id: "sprint",
    name: "🎯 Sprint Planning",
    category: "sprint",
    iconClass: "teal",
    meetings: [
      {
        title: "Sprint Planning: Meetify v2",
        date: "June 5, 2026",
        durationText: "0:25",
        durationSec: 25,
        participants: [
          { name: "Akhil Gupta", initials: "AG", accent: "accent-2" },
          { name: "Sarah Connor", initials: "SC", accent: "accent-1" },
          { name: "David Kim", initials: "DK", accent: "accent-3" }
        ],
        chapters: [
          { time: 0, label: "00:00 — Intro & Agenda" },
          { time: 6, label: "00:06 — Karaoke Transcript Feature" },
          { time: 13, label: "00:13 — CSS Scroll-driven Reveals" },
          { time: 20, label: "00:20 — Wrap-up & Ship Goal" }
        ],
        transcript: [
          { speaker: "Akhil Gupta", time: 0, text: "Hey team, let's kick off our sprint planning for Meetify v2." },
          { speaker: "Akhil Gupta", time: 3, text: "We have some big milestones to hit this week." },
          { speaker: "Sarah Connor", time: 6, text: "Right, we need to make sure the karaoke transcript is super smooth and responsive." },
          { speaker: "Sarah Connor", time: 10, text: "Clicking on words should scrub the audio instantly without delay." },
          { speaker: "David Kim", time: 13, text: "Exactly. Sarah, can you focus on the CSS scroll-driven reveals?" },
          { speaker: "Sarah Connor", time: 16, text: "Absolutely, I'll use the IntersectionObserver fallback for older engines." },
          { speaker: "David Kim", time: 20, text: "Awesome. Let's aim to ship this by Friday morning." },
          { speaker: "Akhil Gupta", time: 23, text: "Perfect. Let's go make it happen!" }
        ]
      }
    ]
  },
  {
    id: "review",
    name: "🚀 Product Reviews",
    category: "review",
    iconClass: "violet",
    meetings: [
      {
        title: "UX Review: Dark Theme Contrast",
        date: "June 2, 2026",
        durationText: "0:20",
        durationSec: 20,
        participants: [
          { name: "Akhil Gupta", initials: "AG", accent: "accent-2" },
          { name: "Sarah Connor", initials: "SC", accent: "accent-1" }
        ],
        chapters: [
          { time: 0, label: "00:00 — Core Aesthetic" },
          { time: 8, label: "00:08 — Glow Effect Settings" },
          { time: 15, label: "00:15 — Onboarding Check" }
        ],
        transcript: [
          { speaker: "Sarah Connor", time: 0, text: "So, how is the new dark-mode theme looking, Akhil?" },
          { speaker: "Akhil Gupta", time: 3, text: "It's gorgeous. The obsidian backdrop and cyan glows really stand out." },
          { speaker: "Sarah Connor", time: 8, text: "Can we add more ambient neon shadows to the interactive cards?" },
          { speaker: "Akhil Gupta", time: 12, text: "Yes, we can use CSS box-shadow with opacity gradients for that premium feel." },
          { speaker: "Sarah Connor", time: 15, text: "Awesome. Let's review the onboarding metrics next." }
        ]
      }
    ]
  },
  {
    id: "sales",
    name: "💼 Sales Debriefs",
    category: "sales",
    iconClass: "pink",
    meetings: [
      {
        title: "Enterprise Client Kickoff (Meetify Sync)",
        date: "May 28, 2026",
        durationText: "0:20",
        durationSec: 20,
        participants: [
          { name: "David Kim", initials: "DK", accent: "accent-3" },
          { name: "Akhil Gupta", initials: "AG", accent: "accent-2" }
        ],
        chapters: [
          { time: 0, label: "00:00 — Client Feedback" },
          { time: 8, label: "00:08 — Platform Integrations" },
          { time: 15, label: "00:15 — Pricing Tier discussion" }
        ],
        transcript: [
          { speaker: "David Kim", time: 0, text: "The client loved the automated playlist categorization in their sandbox test." },
          { speaker: "David Kim", time: 4, text: "They asked if it supports Zoom and Google Meet integrations out of the box." },
          { speaker: "Akhil Gupta", time: 8, text: "I told them we have one-click sync for all major platforms." },
          { speaker: "David Kim", time: 12, text: "Great. Did they mention pricing expectations or user numbers?" },
          { speaker: "Akhil Gupta", time: 15, text: "They're interested in the enterprise plan for 50+ users." }
        ]
      }
    ]
  }
];

// --- APP STATE ---
let activePlaylistIdx = 0;
let activeMeetingIdx = 0;
let currentTime = 0;
let isPlaying = false;
let playbackInterval = null;

// --- DOM ELEMENTS ---
const playlistListContainer = document.getElementById("playlist-list-container");
const activePlaylistNameEl = document.getElementById("active-playlist-name");
const activeMeetingTitleEl = document.getElementById("active-meeting-title");
const activeMeetingDateEl = document.getElementById("active-meeting-date");
const activeMeetingDurationEl = document.getElementById("active-meeting-duration");
const participantAvatarsEl = document.getElementById("participant-avatars");
const playBtn = document.getElementById("play-btn");
const playIcon = playBtn.querySelector(".play-icon");
const pauseIcon = playBtn.querySelector(".pause-icon");
const currentTimeText = document.getElementById("current-time-text");
const totalTimeText = document.getElementById("total-time-text");
const progressBar = document.getElementById("progress-bar");
const progressHandle = document.getElementById("progress-handle");
const scrubContainer = document.getElementById("scrub-container");
const waveformVisualizer = document.getElementById("waveform-visualizer");
const chaptersListContainer = document.getElementById("chapters-list-container");
const transcriptSearch = document.getElementById("transcript-search");
const transcriptBody = document.getElementById("transcript-body");

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  renderPlaylists();
  loadMeeting(0, 0);
  initEventListeners();
  initScrollEffects();
});

// --- RENDER SIDEBAR PLAYLISTS ---
function renderPlaylists() {
  playlistListContainer.innerHTML = "";
  PLAYLISTS_DATA.forEach((playlist, pIdx) => {
    const meeting = playlist.meetings[0]; // display first meeting info
    const isAct = pIdx === activePlaylistIdx;
    
    const li = document.createElement("li");
    li.className = `playlist-item ${isAct ? 'active' : ''}`;
    li.addEventListener("click", () => selectPlaylist(pIdx));
    
    li.innerHTML = `
      <div class="playlist-icon-wrap ${playlist.iconClass}">
        ${playlist.name.substring(0, 2)}
      </div>
      <div class="playlist-info">
        <div class="playlist-name">${playlist.name.substring(2)}</div>
        <div class="playlist-meta">
          <span>1 meeting</span>
          <span>${meeting.durationText}</span>
        </div>
      </div>
    `;
    playlistListContainer.appendChild(li);
  });
}

// --- SWITCH PLAYLIST ---
function selectPlaylist(idx) {
  if (activePlaylistIdx === idx) return;
  activePlaylistIdx = idx;
  activeMeetingIdx = 0; // Default to first meeting
  
  // Highlight active playlist item
  const items = playlistListContainer.querySelectorAll(".playlist-item");
  items.forEach((item, i) => {
    if (i === idx) item.classList.add("active");
    else item.classList.remove("active");
  });
  
  pause();
  loadMeeting(activePlaylistIdx, activeMeetingIdx);
}

// --- LOAD MEETING DATA ---
function loadMeeting(pIdx, mIdx) {
  const playlist = PLAYLISTS_DATA[pIdx];
  const meeting = playlist.meetings[mIdx];
  
  activePlaylistNameEl.textContent = playlist.name;
  activeMeetingTitleEl.textContent = meeting.title;
  activeMeetingDateEl.textContent = meeting.date;
  activeMeetingDurationEl.textContent = meeting.durationText;
  
  // Avatars
  participantAvatarsEl.innerHTML = "";
  meeting.participants.forEach(p => {
    const av = document.createElement("div");
    av.className = `avatar ${p.accent}`;
    av.textContent = p.initials;
    av.title = p.name;
    participantAvatarsEl.appendChild(av);
  });
  
  // Reset Playback metrics
  currentTime = 0;
  updateTimeUI(meeting.durationSec);
  
  // Waveform rendering
  renderWaveform(meeting.durationSec);
  
  // AI Chapters
  renderChapters(meeting.chapters);
  
  // Transcript lines
  renderTranscript(meeting.transcript);
  
  // Reset search box
  transcriptSearch.value = "";
}

// --- GENERATE WAVEFORM BARS ---
function renderWaveform(duration) {
  waveformVisualizer.innerHTML = "";
  const barCount = 60; // 60 bars total for waveform
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("div");
    bar.className = "wave-bar";
    // Generate organic meeting audio curves (valleys and peaks)
    const heightPercentage = Math.floor(Math.sin((i / barCount) * Math.PI * 4.5) * 35) + 55;
    const finalHeight = Math.max(15, Math.min(100, heightPercentage + (Math.random() * 12 - 6)));
    bar.style.height = `${finalHeight}%`;
    waveformVisualizer.appendChild(bar);
  }
}

// --- RENDER CHAPTERS ---
function renderChapters(chapters) {
  chaptersListContainer.innerHTML = "";
  chapters.forEach((chapter) => {
    const tag = document.createElement("div");
    tag.className = "chapter-tag";
    tag.textContent = chapter.label;
    tag.addEventListener("click", () => {
      seekTo(chapter.time);
    });
    chaptersListContainer.appendChild(tag);
  });
}

// --- RENDER TRANSCRIPT ---
function renderTranscript(transcript, searchFilter = "") {
  transcriptBody.innerHTML = "";
  
  transcript.forEach((line) => {
    const minutes = Math.floor(line.time / 60);
    const seconds = line.time % 60;
    const timeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    let textToDisplay = line.text;
    if (searchFilter) {
      const regex = new RegExp(`(${escapeRegex(searchFilter)})`, "gi");
      textToDisplay = line.text.replace(regex, `<span class="search-match">$1</span>`);
    }
    
    const div = document.createElement("div");
    div.className = "transcript-line";
    div.dataset.time = line.time;
    div.addEventListener("click", () => seekTo(line.time));
    
    div.innerHTML = `
      <div class="transcript-time">${timeFormatted}</div>
      <div class="transcript-content">
        <div class="transcript-speaker">${line.speaker}</div>
        <div class="transcript-text">${textToDisplay}</div>
      </div>
    `;
    transcriptBody.appendChild(div);
  });
  
  syncTranscriptHighlight();
}

// --- HELPERS ---
function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

// --- PLAYBACK CONTROLS ---
function togglePlay() {
  if (isPlaying) {
    pause();
  } else {
    play();
  }
}

function play() {
  if (isPlaying) return;
  isPlaying = true;
  playIcon.classList.add("hidden");
  pauseIcon.classList.remove("hidden");
  
  const meeting = PLAYLISTS_DATA[activePlaylistIdx].meetings[activeMeetingIdx];
  
  // Waveform bars dynamic dancing style
  const bars = waveformVisualizer.querySelectorAll(".wave-bar");
  bars.forEach(bar => bar.classList.add("active-playing"));
  
  playbackInterval = setInterval(() => {
    if (currentTime < meeting.durationSec) {
      currentTime++;
      updateTimeUI(meeting.durationSec);
      syncTranscriptHighlight();
    } else {
      // Loop or stop
      seekTo(0);
    }
  }, 1000);
}

function pause() {
  if (!isPlaying) return;
  isPlaying = false;
  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");
  
  // Stop dancing bars
  const bars = waveformVisualizer.querySelectorAll(".wave-bar");
  bars.forEach(bar => bar.classList.remove("active-playing"));
  
  clearInterval(playbackInterval);
}

function seekTo(timeSec) {
  const meeting = PLAYLISTS_DATA[activePlaylistIdx].meetings[activeMeetingIdx];
  currentTime = Math.max(0, Math.min(meeting.durationSec, timeSec));
  updateTimeUI(meeting.durationSec);
  syncTranscriptHighlight();
}

// --- SYNC UI TIMELINE & GRAPHICS ---
function updateTimeUI(totalSec) {
  // text clocks
  const curMin = Math.floor(currentTime / 60);
  const curSec = currentTime % 60;
  currentTimeText.textContent = `${curMin}:${curSec.toString().padStart(2, '0')}`;
  
  const totMin = Math.floor(totalSec / 60);
  const totSec = totalSec % 60;
  totalTimeText.textContent = `${totMin}:${totSec.toString().padStart(2, '0')}`;
  
  // Progress scrub handle
  const percent = (currentTime / totalSec) * 100;
  progressBar.style.width = `${percent}%`;
  progressHandle.style.left = `${percent}%`;
  
  // Update played wave bars
  const bars = waveformVisualizer.querySelectorAll(".wave-bar");
  const barsCount = bars.length;
  const activeBarIdx = Math.floor((currentTime / totalSec) * barsCount);
  
  bars.forEach((bar, i) => {
    if (i <= activeBarIdx) {
      bar.classList.add("played");
    } else {
      bar.classList.remove("played");
    }
  });
}

// --- SYNC TRANSCRIPT HIGHLIGHT (KARAOKE TRACKING) ---
function syncTranscriptHighlight() {
  const lines = transcriptBody.querySelectorAll(".transcript-line");
  let activeLine = null;
  
  lines.forEach((line) => {
    const lineTime = parseInt(line.dataset.time);
    line.classList.remove("highlighted");
    
    // Find the closest line that is <= current time
    if (currentTime >= lineTime) {
      activeLine = line;
    }
  });
  
  if (activeLine) {
    activeLine.classList.add("highlighted");
    
    // Smooth scroll the active sentence into view inside container
    activeLine.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }
  
  // Highlight active chapter
  const meeting = PLAYLISTS_DATA[activePlaylistIdx].meetings[activeMeetingIdx];
  let activeChapterIdx = 0;
  meeting.chapters.forEach((chap, idx) => {
    if (currentTime >= chap.time) {
      activeChapterIdx = idx;
    }
  });
  
  const chapterTags = chaptersListContainer.querySelectorAll(".chapter-tag");
  chapterTags.forEach((tag, idx) => {
    if (idx === activeChapterIdx) {
      tag.classList.add("active");
    } else {
      tag.classList.remove("active");
    }
  });
}

// --- SCRUBBER CLICK EVENTS ---
function handleScrubClick(e) {
  const rect = scrubContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const clickRatio = Math.max(0, Math.min(1, clickX / width));
  
  const meeting = PLAYLISTS_DATA[activePlaylistIdx].meetings[activeMeetingIdx];
  const targetTime = Math.round(clickRatio * meeting.durationSec);
  seekTo(targetTime);
}

// --- SEARCH TRANSCRIPT ---
function handleSearch(e) {
  const query = e.target.value.trim();
  const meeting = PLAYLISTS_DATA[activePlaylistIdx].meetings[activeMeetingIdx];
  renderTranscript(meeting.transcript, query);
}

// --- GENERAL EVENTS ---
function initEventListeners() {
  // Play button click
  playBtn.addEventListener("click", togglePlay);
  
  // Scrub bar click/drag
  scrubContainer.addEventListener("click", handleScrubClick);
  
  // Search input typing
  transcriptSearch.addEventListener("input", handleSearch);
  
  // Scrub drag interaction fallback support
  let isDragging = false;
  
  scrubContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    handleScrubClick(e);
  });
  
  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      handleScrubClick(e);
    }
  });
  
  window.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

// --- BROWSER COMPATIBILITY FALLBACK SCROLL EFFECTS ---
function initScrollEffects() {
  // Fallback for shrinking header on scroll
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    const header = document.querySelector('.app-header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.height = '64px';
        header.style.background = 'rgba(11, 7, 26, 0.85)';
        header.style.backdropFilter = 'blur(12px)';
        header.style.webkitBackdropFilter = 'blur(12px)';
        header.style.borderColor = 'rgba(255, 255, 255, 0.07)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      } else {
        header.style.height = '80px';
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.webkitBackdropFilter = 'none';
        header.style.borderColor = 'transparent';
        header.style.boxShadow = 'none';
      }
    });
  }

  // Fallback for scroll entry reveals (IntersectionObserver)
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal-on-scroll").forEach(el => {
    observer.observe(el);
  });
}
