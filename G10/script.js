'use strict';
// DOM Elements
const myIdEl = document.getElementById('my-id');
const roomIdInput = document.getElementById('room-id-input');
const questBoardEl = document.getElementById('quest-board');
const statusEl = document.getElementById('status');
const roomCreationEl = document.getElementById('room-creation');
const roomInfoEl = document.getElementById('room-info');

let peer = null;
let myPeerId = null;
let isHost = false;
let guests = {}; // Host: store connections to guests
let guestsNames = {}; // Host: map peerId -> display name
let hostConn = null; // Guest: store connection to host
let phase = 'selection'; // selection | client_info
let hostApiKey = null; // only stored in host's browser memory
let participantName = null; // Guest: the name they enter before joining

// --- Quest List ---
let questBoardState = [
    {
        id: 0,
        title: "GameHub — Community Landing (Pre-Launch)",
        owner: null,
        sender: "Community Manager, GameHub",
        background: "We're soft-launching a community for indie gamers and streamers and need a single landing that feels energetic and playful.",
        goal: "Capture interest, get visitors to join our waitlist, and invite them to “try a surprise” on the page.",
        scope: "One scrolling homepage with a main header area, About, and a short action section (for example: a signup button).",
        mustHaveInteractions: [
            "Hover main headline briefly switches to a playful variant (e.g., 'Press Start!').",
            "Join the Waitlist button shows an on-page click counter.",
            "Change Vibe button cycles or shuffles the page color theme."
        ],
        assets: "Logo (PNG), color swatch, 2-sentence blurb, 3 game screenshots.",
        constraints: "Single page; mobile-friendly; no login or backend.",
        successCriteria: "Clear action button, fast load, works on recent Chrome/Edge; brand feels fun.",
    handoff: "Share a live link and a zipped project folder.",
    persona: `Name / Role: Mia “PixelM” Ramos, Community Manager
Age / Context: 26, runs Discord/Twitch events for indie gamers
Goals: Grow a waitlist; convey playful, inclusive vibe; make visitors interact at least once
Pain Points: No dev team; low budget; hates slow pages; easily derailed by clutter
Brand/Tone: Energetic, quirky, neon accents, short copy
Content Ready: Logo, 3 screenshots, 2-sentence pitch
Devices: 70% mobile; shares links in chats/IG stories
Accessibility/Constraints: Motion-light; readable on dark backgrounds
Success Looks Like: Clear CTA clicks + “surprise” interaction used
Quote: “If it loads fast and makes people smile, we win.”`,
    },
    {
        id: 1,
        title: "Bean & Bloom — Micro Café Site",
        owner: null,
        sender: "Owner, Bean & Bloom Café",
        background: "A small neighborhood café needs a clean homepage to showcase vibe and specials.",
        goal: "Encourage foot traffic and promote the seasonal latte.",
        scope: "Home with a prominent header, Menu Highlights, Visit Us (location/hours).",
        mustHaveInteractions: [
            "Hover café name swaps to a handwritten 'signature' version.",
            "'I'd try this!' button counts clicks near the seasonal drink.",
            "Mood toggle that changes background color (daylight vs evening)."
        ],
        assets: "Logo (SVG), 4 drink photos, store hours, Google Maps link, tagline.",
        constraints: "One page, fast to scan; no online ordering.",
        successCriteria: "Looks inviting on phone screens; seasonal highlight stands out.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Daniel Cho, Owner-Barista
Age / Context: 34, hands-on; updates specials weekly on IG
Goals: Show hours/location; spotlight seasonal latte; feel cozy
Pain Points: No time to manage; hates walls of text; no online ordering yet
Brand/Tone: Warm, minimalist, natural textures
Content Ready: SVG logo, 4 drink photos, hours, tagline
Devices: Mostly mobile, quick, one-hand browsing
Accessibility/Constraints: High contrast for outdoor glare; small images for speed
Success Looks Like: Customers say “Saw your seasonal on the site”
Quote: “Keep it tasteful and quick—like a good espresso.”`,
    },
    {
        id: 2,
        title: "TrailQuest — Hiking Club Info Page",
        owner: null,
        sender: "Coordinator, TrailQuest",
        background: "Volunteer-run hiking club needs a simple info page for new members.",
        goal: "Explain who we are, show upcoming trail types, invite people to 'cheer'.",
        scope: "Sections: Welcome, Trails We Do, Join the Club.",
        mustHaveInteractions: [
            "Hover hero title swaps to a trail emoji version (🌲⛰️).",
            "'Cheer this club!' button with visible click counter.",
            "Trail Theme button that randomizes a natural color palette."
        ],
        assets: "Wordmark (PNG), 3 trail pics, short copy, social links.",
        constraints: "Single page; no calendar integration needed.",
        successCriteria: "Friendly tone, quick load, good contrast for outdoor photos.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Nora Alvarez, Volunteer Coordinator
Age / Context: 41, organizes weekend hikes; posts routes in WhatsApp
Goals: Explain who they are; display trail types; spark sign-up interest
Pain Points: No calendar integration; mixed tech comfort in audience
Brand/Tone: Friendly, outdoorsy, approachable
Content Ready: Wordmark, 3 trail pics, short “about,” social links
Devices: 60% mobile; viewed in bright sun
Accessibility/Constraints: Large tap targets; strong contrast; simple layout
Success Looks Like: People share link; more first-timers join
Quote: “Make it clear enough my dad can read it on a trailhead.”`,
    },
    {
        id: 3,
        title: "ByteReview — Tech Mini-Mag",
        owner: null,
        sender: "Editor, ByteReview",
        background: "We publish short gadget takes and need a crisp front page to feature mini articles.",
        goal: "Let visitors skim reviews and tap a CTA to 'like' the issue.",
        scope: "Home with a prominent header, Featured Reviews, and About.",
        mustHaveInteractions: [
            "Hovering the issue title flips to an alternate headline.",
            "'I like this issue' button with on-page counter.",
            "Theme Shuffle to change accent colors (techy neon palette)."
        ],
        assets: "Logo (PNG), 3 product thumbnails, 2 review blurbs (100-150 words each).",
        constraints: "Lightweight; no CMS.",
        successCriteria: "Sharp typography, clear hierarchy, quick skim.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Arjun Patel, Editor
Age / Context: 29, publishes bite-size gadget takes weekly
Goals: Feature 2–3 mini reviews; nudge a “like this issue” interaction
Pain Points: Hates heavy pages; wants crisp typography; no CMS yet
Brand/Tone: Clean, modern, slightly nerdy; neon accents ok
Content Ready: Logo, 3 product thumbs, 2 blurbs
Devices: Desktop at work, mobile on commute
Accessibility/Constraints: Headings hierarchy; link states visible
Success Looks Like: High skim-ability + measurable likes
Quote: “If I can’t scan it in 10 seconds, it’s not working.”`,
    },
    {
        id: 4,
        title: "Kickstart FC — Youth Sports One-Pager",
        owner: null,
        sender: "Program Lead, Kickstart FC",
        background: "Local youth football program needs a one-pager parents can share.",
        goal: "Explain program benefits; collect enthusiasm with a click counter.",
        scope: "Top section, Program Highlights, Practice Info.",
        mustHaveInteractions: [
            "Hover headline swaps to chant mode ('GO KICKSTART!').",
            "'Cheer!' button increments a visible cheer count.",
            "Team Colors toggle that rotates background/accent colors."
        ],
        assets: "Crest (PNG), 2 team photos, bullet benefits, practice schedule text.",
        constraints: "Single page; no sign-ups.",
        successCriteria: "Friendly for parents on mobile; energetic presentation.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Tasha Okoye, Program Lead
Age / Context: 38, coordinates coaches; parents ask for info links
Goals: Explain benefits quickly; energize parents/kids; practice info visible
Pain Points: Parents on old phones; time-poor audience
Brand/Tone: Energetic, optimistic, team colors prominent
Content Ready: Crest, team photos, bullet benefits, practice times
Devices: 80% mobile; often on school Wi-Fi/data
Accessibility/Constraints: Big text; minimal scrolling; fast load
Success Looks Like: Parents forward link in WhatsApp groups
Quote: “Make it shareable and hype without being cheesy.”`,
    },
    {
        id: 5,
        title: "Slice Society — Pizza Pop-Up",
        owner: null,
        sender: "Organizer, Slice Society",
        background: "Monthly pizza pop-up wants a page to announce the next date and menu.",
        goal: "Tease the menu; let visitors vote 'Which slice sounds best?' with a simple counter.",
        scope: "Top section, Featured Slices, Event Details.",
        mustHaveInteractions: [
            "Hover page title reveals a cheeky alternate (e.g., 'In Crust We Trust').",
            "'Vote for this slice' button updates a count.",
            "Surprise Flavor button randomizes page background color."
        ],
        assets: "Logo (PNG), 3 slice photos, date/time/location, short copy.",
        constraints: "Single page; no forms.",
        successCriteria: "Playful, mouth-watering imagery, quick to read.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Marco DeLuca, Organizer
Age / Context: 32, monthly events; IG-first marketing
Goals: Announce next date/menu; fun vote on favorite slice
Pain Points: Zero patience for slow sites; no forms/backends
Brand/Tone: Playful, bold, foodie photography
Content Ready: Logo, 3 slice photos, date/time/location
Devices: Mobile-heavy; quick glances
Accessibility/Constraints: Alt text for images; compressed photos
Success Looks Like: People arrive saying “We voted for ___ slice”
Quote: “Make it tasty on the eyes and done.”`,
    },
    {
        id: 6,
        title: "IndieWaves — Music Artist Splash",
        owner: null,
        sender: "Manager, IndieWaves",
        background: "New single dropping; need a splash page with vibe and links.",
        goal: "Build hype; let visitors 'show love.'",
        scope: "Top section showing artist name, About the Track, Listen/Follow links.",
        mustHaveInteractions: [
            "Hover over the track title switches to a stylized alt title.",
            "'Show Love' button increases a heart count.",
            "Night/Day theme toggle or color shuffle for mood."
        ],
        assets: "Cover art, 2 promo photos, 1-paragraph blurb, streaming links.",
        constraints: "Single page; fast load; work well on dark backgrounds.",
        successCriteria: "Feels like a real artist splash; obvious streaming links.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Lani Kim, Artist Manager
Age / Context: 27, coordinating a single drop; links to streaming
Goals: Build hype; get follows/plays; vibe shift (day/night)
Pain Points: Overdesign kills mood; wants fast, moody visuals
Brand/Tone: Atmospheric, minimal copy, strong imagery
Content Ready: Cover art, 2 photos, one-paragraph blurb, links
Devices: Mobile first; link-in-bio traffic
Accessibility/Constraints: Dark-mode friendly; legible contrast
Success Looks Like: Fans say “that splash was sick” + follow clicks
Quote: “One page, one mood, one action.”`,
    },
    {
        id: 7,
        title: "PageTurners — Student Book Club Hub",
        owner: null,
        sender: "Coordinator, PageTurners",
        background: "Student-run club needs a simple hub to showcase current picks.",
        goal: "Show the monthly pick; let visitors 'bookmark' the page with a playful counter.",
        scope: "Top section, This Month's Pick, Past Picks.",
        mustHaveInteractions: [
            "Hover headline reveals a witty alt title.",
            "'Bookmark this!' button increments an on-page count.",
            "Reading Light toggle that switches background tone."
        ],
        assets: "Club wordmark, book cover(s), 2 blurbs.",
        constraints: "One page; no logins or comments.",
        successCriteria: "Cozy, readable typography; friendly tone.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Eli Park, Club Coordinator
Age / Context: 17, student-led; announces monthly pick
Goals: Show current pick; show past picks; playful “bookmark” counter
Pain Points: No time to maintain; needs simple template
Brand/Tone: Cozy, friendly, readable typography
Content Ready: Wordmark, current cover, short blurbs
Devices: Mixed; school laptops + phones
Accessibility/Constraints: Dyslexia-friendly spacing/line length
Success Looks Like: Members actually visit from classroom link
Quote: “Feels like a library nook on my phone.”`,
    },
    {
        id: 8,
        title: "PixelFrame — Photography Mini-Portfolio",
        owner: null,
        sender: "Owner, PixelFrame",
        background: "Solo photographer wants a minimal demo page.",
        goal: "Showcase 3 photos and gather interest.",
        scope: "Top section, Gallery Row, Contact Links.",
        mustHaveInteractions: [
            "Hover brand name swaps to a camera-emoji version.",
            "'Appreciate this set' button shows a live counter.",
            "Studio Light toggle or randomized neutral background tones."
        ],
        assets: "Logo (SVG), 3 photos, short bio, IG link.",
        constraints: "Single page; images optimized.",
        successCriteria: "Visual focus; loads fast on mobile.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Sofia Martínez, Freelance Photographer
Age / Context: 31, books clients via IG DMs; needs quick sampler
Goals: Showcase 3 photos nicely; encourage IG follow/contact
Pain Points: Heavy pages ruin images; hates clutter
Brand/Tone: Minimal, gallery-first, neutral palette
Content Ready: SVG logo, 3 hero photos, short bio, IG link
Devices: High-res phones; some desktop viewing
Accessibility/Constraints: Proper alt text; keyboard focus visible
Success Looks Like: “Loved your mini site—DM sent!”
Quote: “Let the photos speak; the rest should whisper.”`,
    },
    {
        id: 9,
        title: "PawPals — Animal Shelter Spotlight",
        owner: null,
        sender: "Volunteer Lead, PawPals",
        background: "We highlight one adoptable pet each week and need a warm page.",
        goal: "Encourage visits to the shelter and adoption interest.",
        scope: "Top section with pet photo, About Me, Visit/Contact info.",
        mustHaveInteractions: [
            "Hover the pet's name reveals a fun nickname.",
            "'I'd visit to meet!' button increments a friendly counter.",
            "Playful Mode button changes background color."
        ],
        assets: "Logo, 1-2 pet photos, short story, address/hours.",
        constraints: "Single page; no forms.",
        successCriteria: "Warm, approachable, accessible on phones.",
    handoff: "Live link + zipped files.",
    persona: `Name / Role: Jamal Reed, Volunteer Lead
Age / Context: 36, highlights one adoptable pet weekly
Goals: Warm intro to featured pet; encourage shelter visits
Pain Points: Audience ranges from kids to seniors; emotions matter
Brand/Tone: Friendly, hopeful, gentle imagery
Content Ready: Logo, pet photos, short story, address/hours
Devices: Mostly mobile; shared via Facebook/WhatsApp
Accessibility/Constraints: Clear text; large buttons; alt text
Success Looks Like: Visitors say “We saw [PetName] online!”
Quote: “If someone smiles and wants to visit, we succeeded.”`,
    }
];

// Optional class tips attached to the state for teacher reference (not required by the app)
const questBoardTeacherTips = {
    quickScript: "You’re a small web studio. Pick one client brief that matches your interests. Deliver a clean one-page site that hits the client’s goals and must-have interactions. Share a link and zipped folder at the deadline. Afterwards, make a tiny personal version to prove your skills.",
    handoutOffer: "If needed, these can be packaged into printable one-pagers per client and a teacher hint sheet (semantics, file linking, roles, QA checklist)."
};

// --- 1. INITIALIZATION ---
function initializePeer() {
    peer = new Peer();

    peer.on('open', (id) => {
        myPeerId = id;
        myIdEl.value = id;
        statusEl.textContent = 'Ready to create or join a room.';
    });

    // Hide any 'Create Room' controls (buttons with onclick="createRoom()") so students don't accidentally create rooms.
    // Teachers can reveal them with Ctrl+Shift+T.
    peer.on('open', () => {
        try {
            const els = Array.from(document.querySelectorAll('[onclick]'));
            els.forEach(el => {
                const oc = el.getAttribute('onclick') || '';
                if (oc.includes('createRoom')) {
                    el.setAttribute('data-hidden-by-teacher', '1');
                    el.style.display = 'none';
                }
            });
        } catch (e) {
            // ignore if DOM not ready
        }
    });

    // Reveal/hide teacher-only controls with Ctrl+Shift+T
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key && e.key.toLowerCase() === 't') {
            const hidden = document.querySelectorAll('[data-hidden-by-teacher]');
            hidden.forEach(el => {
                if (el.style.display === 'none') el.style.display = '';
                else el.style.display = 'none';
            });
            alert('Toggled teacher controls.');
        }
    });

    // Host: Listen for incoming connections from guests
    peer.on('connection', (conn) => {
        if (isHost) {
            console.log(`Guest ${conn.peer} connected.`);
            guests[conn.peer] = conn;

            // Setup listener for data from this guest
            conn.on('data', (data) => handleIncomingData(conn.peer, data));
            conn.on('close', () => {
                console.log(`Guest ${conn.peer} disconnected.`);
                // Release their quests
                questBoardState.forEach(quest => {
                    if (quest.owner === conn.peer) {
                        quest.owner = null;
                    }
                });
                delete guests[conn.peer];
                delete guestsNames[conn.peer];
                broadcastState();
            });

            // Send the current state to the new guest
            conn.on('open', () => {
                // Send initial app state to the new guest
                conn.send(JSON.stringify({ type: 'initial_state', payload: { state: questBoardState, phase, guestsNames } }));
            });
        }
    });

    peer.on('error', (err) => {
        console.error(err);
        alert(`An error occurred: ${err.message}`);
        statusEl.textContent = `Error: ${err.type}`;
    });
}

// --- 2. HOST & GUEST LOGIC ---

// Host: Broadcasts the current quest board state to all guests
function broadcastState() {
    if (!isHost) return;
    const message = JSON.stringify({ type: 'update_state', payload: { state: questBoardState, phase, guestsNames } });
    for (const peerId in guests) {
        guests[peerId].send(message);
    }
    // Host also re-renders its own view
    renderQuestBoard();
}

// Host: Handles data received from guests
function handleIncomingData(senderId, data) {
    const parsed = JSON.parse(data);
    if (parsed.type === 'introduce' && isHost) {
        const name = parsed.payload && parsed.payload.name ? parsed.payload.name : `Guest-${senderId.substring(0,6)}`;
        guestsNames[senderId] = name;
        broadcastState();
        return;
    }
    if (parsed.type === 'claim_quest') {
        const questId = parsed.payload.id;
        const quest = questBoardState.find(q => q.id === questId);
        // Only allow claiming if it's available or owned by the claimant (for releasing)
        if (quest && (quest.owner === null || quest.owner === senderId)) {
            // Toggle ownership
            quest.owner = quest.owner === senderId ? null : senderId;
            // record a friendly name snapshot on the quest so UI can display it
            if (quest.owner) {
                quest.ownerName = guestsNames && guestsNames[quest.owner] ? guestsNames[quest.owner] : quest.owner.substring(0,6) + '...';
            } else {
                quest.ownerName = null;
            }
            console.log(`Peer ${senderId} updated quest ${questId}. New owner: ${quest.owner}`);
            broadcastState();
        }
    
    } else if (parsed.type === 'advance_phase' && isHost) {
        phase = parsed.payload.phase || 'client_info';
        broadcastState();
    } else if (parsed.type === 'chat_message' && isHost) {
        // relay to OpenAI using hostApiKey and reply with chat_response
        const { questId, text } = parsed.payload;
        (async () => {
            try {
                if (!hostApiKey) throw new Error('Host OpenAI API key not set.');
                const questObj = questBoardState.find(q => q.id === questId);
                let systemPrompt = `You are assisting with gathering client info for the project: ${questObj.title}`;
                if (questObj.persona) {
                    systemPrompt += `\n\nUse this internal persona to answer as if you were assisting the design team (do not reveal persona to students):\n${questObj.persona}`;
                }
                const resp = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${hostApiKey}` },
                    body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }], max_tokens: 400 })
                });
                const data = await resp.json();
                const reply = data?.choices?.[0]?.message?.content || 'No response';
                // send back to the guest who asked (senderId)
                if (guests[senderId]) {
                    guests[senderId].send(JSON.stringify({ type: 'chat_response', payload: { questId, reply } }));
                }
            } catch (err) {
                console.error(err);
                if (guests[senderId]) {
                    guests[senderId].send(JSON.stringify({ type: 'chat_response', payload: { questId, reply: 'Error: ' + err.message } }));
                }
            }
        })();
    }
}

// Guest: Handles data received from the host
function handleHostData(data) {
    const parsed = JSON.parse(data);
    if (parsed.type === 'initial_state' || parsed.type === 'update_state') {
        // payload shape for host initial_state: { state, phase }
        if (parsed.payload.state) questBoardState = parsed.payload.state;
        if (parsed.payload.phase) phase = parsed.payload.phase;
        if (parsed.payload.guestsNames) {
            // store a local copy so UI can show friendly names
            guestsNames = parsed.payload.guestsNames;
        }
        renderQuestBoard();
    } else if (parsed.type === 'chat_response') {
        const { questId, reply } = parsed.payload;
        // simple UX: alert the guest with the reply
        alert(`Host response for quest ${questId}:\n\n${reply}`);
    }
}

// --- 3. UI RENDERING ---
function renderQuestBoard() {
    questBoardEl.innerHTML = ''; // Clear previous state
    // Don't reveal quests until the user is the host or has joined as a guest
    const connectedAsGuest = hostConn && hostConn.open;
    if (!isHost && !connectedAsGuest) {
        const notice = document.createElement('div');
        notice.className = 'join-notice p-4 bg-yellow-50 border border-yellow-200 rounded';
        notice.innerHTML = `\
            <h3 style="margin:0 0 8px 0">Join to see available quests</h3>\
            <p style="margin:0 0 8px 0">You need to join a room to view and claim quests.</p>\
        `;
        questBoardEl.appendChild(notice);
        return;
    }
    // Host controls area
    if (isHost) {
        const hostControls = document.createElement('div');
        hostControls.className = 'mb-4 p-3 bg-white rounded shadow sm:flex sm:items-center sm:justify-between';
        // build guest list HTML
        const guestListHtml = Object.keys(guestsNames).length ? `<div class="text-sm text-gray-700">Guests: ${Object.values(guestsNames).map(n => `<span style="margin-right:8px">${n}</span>`).join('')}</div>` : '<div class="text-sm text-gray-500">No guests yet</div>';
        hostControls.innerHTML = `
            <div style="min-width:200px">${guestListHtml}<div class="text-sm text-gray-700 mt-1">Phase: <strong>${phase}</strong></div></div>
            <div class="mt-2 sm:mt-0 flex gap-2 items-center">
                <button id="copy-id" class="bg-gray-500 text-white py-1 px-2 rounded text-sm">Copy ID</button>
                <button id="lock-choices" class="bg-indigo-600 text-white py-1 px-2 rounded text-sm">Lock choices</button>
            </div>
        `;
        questBoardEl.appendChild(hostControls);

    // attach listeners
    hostControls.querySelector('#copy-id').addEventListener('click', () => {
            const id = myPeerId || '';
            if (!id) return alert('No Room ID available yet.');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(id).then(() => alert('Room ID copied to clipboard.'))
                    .catch(() => prompt('Copy this Room ID:', id));
            } else {
                prompt('Copy this Room ID:', id);
            }
        });
        hostControls.querySelector('#lock-choices').addEventListener('click', () => {
            phase = 'client_info';
            // broadcast a message-type style update
            broadcastState();
        });
    }
    questBoardState.forEach(quest => {
        const isOwnedByMe = quest.owner === myPeerId;
        const isOwnedByOther = quest.owner !== null && quest.owner !== myPeerId;

        const questDiv = document.createElement('div');
        questDiv.className = `quest-item p-4 mb-4 rounded-lg flex flex-col shadow ${isOwnedByMe ? 'bg-blue-50' : isOwnedByOther ? 'bg-gray-100' : 'bg-white'}`;

        let ownerText = '';
        if (isOwnedByMe) {
            ownerText = `<span class="text-xs font-bold text-blue-700">CLAIMED BY YOU</span>`;
        } else if (isOwnedByOther) {
            // Prefer the snapshot name stored on the quest, then guestsNames mapping, then short id
            const ownerName = quest.ownerName || (guestsNames && guestsNames[quest.owner]) || (quest.owner ? quest.owner.substring(0, 6) + '...' : 'Unknown');
            ownerText = `<span class="text-xs font-semibold text-gray-500">Taken by ${ownerName}</span>`;
        } else {
            ownerText = `<span class="text-xs font-semibold text-green-600">Available</span>`;
        }

        const shortBackground = quest.background ? `<p class="text-sm text-gray-600 mt-2">${quest.background}</p>` : '';
        const interactions = (quest.mustHaveInteractions || []).map(i => `<li class="text-sm text-gray-700">• ${i}</li>`).join('');

        questDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-semibold text-gray-800">${quest.title}</p>
                    <div class="text-xs text-gray-600"><span class="font-semibold">From:</span> <span class="font-medium text-gray-800">${quest.sender || 'Unknown'}</span></div>
                    <div class="text-xs text-gray-500 mt-1">${quest.scope ? quest.scope : ''}</div>
                    ${ownerText}
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="claimQuest(${quest.id})" class="claim-btn ${phase !== 'selection' ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'} font-bold py-1 px-3 rounded-md transition-colors duration-200" data-quest-id="${quest.id}" ${phase !== 'selection' ? 'disabled' : isOwnedByOther ? 'disabled' : ''}>
                        ${isOwnedByMe ? 'Release' : 'Claim'}
                    </button>
                    <button onclick="toggleDetails(${quest.id})" class="details-btn bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-1 px-2 rounded">Details</button>
                </div>
            </div>
            <div id="details-${quest.id}" class="quest-details mt-3 hidden bg-gray-50 p-3 rounded border border-gray-200">
                ${shortBackground}
                <p class="text-sm"><strong>Goal:</strong> ${quest.goal || ''}</p>
                <p class="text-sm"><strong>Assets:</strong> ${quest.assets || ''}</p>
                <p class="text-sm"><strong>Constraints:</strong> ${quest.constraints || ''}</p>
                <p class="text-sm"><strong>Success:</strong> ${quest.successCriteria || ''}</p>
                <ul class="mt-2">${interactions}</ul>
                <div class="mt-3">
                    ${phase === 'client_info' ? `<div class="mt-2"><input id="chat-input-${quest.id}" class="border p-1 text-sm w-full" placeholder="Ask a question for this client..." /><button id="send-chat-${quest.id}" class="mt-2 bg-blue-500 text-white py-1 px-2 rounded text-sm">Send to host</button></div>` : ''}
                </div>
            </div>
        `;

        const button = questDiv.querySelector('.claim-btn');
        if (isOwnedByMe && button) {
            button.classList.replace('bg-green-500', 'bg-yellow-500');
            button.classList.replace('hover:bg-green-600', 'hover:bg-yellow-600');
        }
        if (isOwnedByOther && button) {
            button.classList.add('opacity-50', 'cursor-not-allowed');
        }

        questBoardEl.appendChild(questDiv);
    // attach guest chat send handlers
    {
            // guest chat send handlers
            const sendBtn = document.getElementById(`send-chat-${quest.id}`);
            const chatInput = document.getElementById(`chat-input-${quest.id}`);
            if (sendBtn && chatInput) {
                sendBtn.addEventListener('click', () => {
                    const text = chatInput.value.trim();
                    if (!text) return alert('Please type a question.');
                    const msg = JSON.stringify({ type: 'chat_message', payload: { questId: quest.id, text } });
                    if (hostConn) hostConn.send(msg);
                });
            }
    }
    });
}

// Toggle visibility of the detailed info block for a quest
function toggleDetails(questId) {
    const el = document.getElementById(`details-${questId}`);
    if (!el) return;
    el.classList.toggle('hidden');
}

// --- 4. UI EVENT LISTENERS ---
function createRoom() {
    isHost = true;
    statusEl.textContent = 'Room created!';
    roomCreationEl.classList.add('hidden');
    roomInfoEl.textContent = `You are the HOST. Room ID: ${myPeerId}`;
    roomInfoEl.classList.remove('hidden');
    renderQuestBoard();
}

function joinRoom() {
    const hostId = roomIdInput.value.trim();
    if (!hostId) return alert('Please enter a Room ID.');
    // Require a participant name before joining
    if (!participantName) {
        const n = prompt('Please enter your group name (this will be shown to everyone):');
        if (!n) return alert('Name required to join.');
        participantName = n.trim();
    }
    if (hostId == myPeerId) return alert('You cannot join your own room. Create a room instead.');

    hostConn = peer.connect(hostId);
    statusEl.textContent = `Joining room ${hostId}...`;

    hostConn.on('open', () => {
        statusEl.textContent = `Joined room ${hostId}!`;
        roomCreationEl.classList.add('hidden');
        roomInfoEl.textContent = `You are a GUEST in room: ${hostId}`;
        roomInfoEl.classList.remove('hidden');
        // introduce ourselves with a name
        try {
            hostConn.send(JSON.stringify({ type: 'introduce', payload: { name: participantName } }));
        } catch (e) {
            console.warn('Failed to send introduce message', e);
        }
    });

    hostConn.on('data', handleHostData);
    hostConn.on('close', () => {
        alert('Connection to the host was lost.');
        window.location.reload();
    });
}

function claimQuest(questId) {
    const message = { type: 'claim_quest', payload: { id: questId } };

    if (isHost) {
        // Host directly modifies its own state and broadcasts
        handleIncomingData(myPeerId, JSON.stringify(message));
    } else if (hostConn) {
        // Guest sends request to host
        hostConn.send(JSON.stringify(message));
    }
}

// questBoardEl.addEventListener('click', (e) => {
//     if (e.target.classList.contains('claim-btn')) {
//         const questId = parseInt(e.target.dataset.questId);
//         const message = { type: 'claim_quest', payload: { id: questId } };

//         if (isHost) {
//             // Host directly modifies its own state and broadcasts
//             handleIncomingData(myPeerId, JSON.stringify(message));
//         } else if (hostConn) {
//             // Guest sends request to host
//             hostConn.send(JSON.stringify(message));
//         }
//     }
// });

// --- 5. START THE APP ---
initializePeer();
renderQuestBoard(); // Initial render for non-connected view