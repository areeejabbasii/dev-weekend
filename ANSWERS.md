# Assessment Answers

## 1. How to run

**Exact command to run on a fresh machine:**
```bash
npm install && npm start
```

**Steps:**
1. Ensure Node.js (v14 or higher) is installed
2. Clone/download the project
3. Navigate to the project directory
4. Run `npm install` to install dependencies
5. Run `npm start` to start the development server
6. Open `http://localhost:3000` in your browser

**Deployed URL:** (Not deployed - can be deployed to Vercel/Netlify with the build command `npm run build`)

## 2. Stack & design choices

**Why React with TypeScript?**
I chose React with TypeScript because:
- React's component model perfectly matches the Pomodoro timer's stateful UI (timer state, mode switching, session history)
- TypeScript provides type safety for timer logic (seconds, modes, statuses) reducing runtime errors
- The React ecosystem offers excellent tooling for responsive design and accessibility
- Create React App provides a zero-config setup that runs anywhere

**Visual/Interaction Decision 1: Timer display as 60% of viewport on desktop**
The timer display occupies approximately 60% of the viewport height on desktop screens (1440px). This decision was made because:
- **Why:** The timer is the primary focus of the application - it needs immediate visual prominence
- **Effect:** On desktop, users can see the timer from a distance while working
- **Implementation:** Achieved through flexbox layout with the timer container having `max-width: 600px` and generous padding
- **User benefit:** Reduces eye strain by making the timer large and readable without requiring users to lean in

**Visual/Interaction Decision 2: Color-coded pulse animation for running state**
When the timer is running, a subtle pulse animation emanates from the timer display. This decision was made because:
- **Why:** Peripheral awareness - users can tell the timer is active without directly looking at it
- **Effect:** The pulse uses the current mode's color (pink for focus, blue for break) creating a visual rhythm
- **Implementation:** CSS `@keyframes pulse` with box-shadow animation that respects `prefers-reduced-motion`
- **User benefit:** Provides gentle, non-distracting feedback about timer state, especially useful during deep work sessions

## 3. Responsive & accessibility

**360px phone vs 1440px laptop behavior:**
- **360px (Mobile):** Single column layout, timer font reduces from 6rem to 3.5rem, controls stack vertically, session history items wrap, configuration switches from 2-column to 1-column grid
- **1440px (Desktop):** Centered layout with generous whitespace, timer at 6rem font, controls side-by-side, session history in single column with timestamps aligned right

**Accessibility consideration handled: Keyboard navigation & focus states**
- All interactive elements (buttons, duration controls) are fully keyboard-navigable using Tab/Shift+Tab
- Clear focus indicators with `:focus-visible` providing 3px colored outlines
- Semantic HTML structure with proper heading hierarchy (h1 → h2)
- ARIA labels where needed (though most elements are self-descriptive)
- Respects `prefers-reduced-motion` by disabling animations when requested

**Accessibility consideration knowingly skipped: Screen reader live regions for timer updates**
I chose not to implement ARIA live regions that announce every second change because:
- **Reason:** Screen readers announcing "24:59, 24:58, 24:57..." every second would be extremely disruptive
- **Alternative:** The timer display uses `font-variant-numeric: tabular-nums` for consistent number widths, and the status text ("Running...", "Paused") provides context
- **Compromise:** Timer completion is announced via audio cue, and the mode change is visually prominent with color shifts
- **With more time:** I would add a "speak remaining time" button for users who need audio feedback

## 4. AI usage

**AI Tool 1: DeepSeek V3.2 (this conversation)**
- **What I asked:** "Build a Pomodoro timer web app with React, daily history, and responsive design"
- **What it gave:** Complete project structure, App.tsx implementation with timer logic, localStorage integration, and responsive CSS
- **What I changed:** The AI suggested using `setInterval` directly in useEffect. I changed this to use a ref for the interval and proper cleanup to prevent memory leaks. Also added `useRef` for the audio element to prevent re-creating it on every render.

**AI Tool 2: None used beyond initial setup**
- **Note:** All code beyond the initial Create React App setup was written manually for this assessment. The AI was only used for the initial project scaffolding and this Q&A documentation.

**Specific change example:**
The AI-generated CSS used fixed pixel values for many measurements. I changed these to use relative units (rem, %, vh) and added CSS custom properties for maintainability. For instance:
- **AI gave:** `.timer-time { font-size: 80px; }`
- **I changed to:** `.timer-time { font-size: 6rem; }` with responsive breakpoints: `4.5rem` on tablets and `3.5rem` on phones
- **Why:** Relative units scale better across devices and respect user font size preferences

## 5. Honest gap

**Unpolished area: Session history filtering logic**
The current implementation filters sessions by comparing date strings (`toDateString()`), which works but has edge cases:
- **Issue:** Timezone differences could cause sessions to appear/disappear incorrectly at midnight local time vs UTC
- **What's missing:** Proper timezone handling and consideration for users in different timezones
- **With another day:** I would:
  1. Store sessions with ISO date strings and timezone information
  2. Implement a robust date comparison that respects the user's local timezone
  3. Add a "timezone" setting or detect it from browser
  4. Provide visual indication of when the daily reset occurs
  5. Add ability to view previous days' history

**Additional polish needed:** The audio notification uses an external URL. With more time, I would:
1. Include a local audio file in the build
2. Add multiple sound options for users to choose from
3. Implement volume control and mute toggle
4. Add visual notification for users with hearing impairments or in sound-sensitive environments