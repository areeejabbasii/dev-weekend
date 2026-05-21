# Pomodoro Timer

A beautiful, responsive Pomodoro timer web application built with React and TypeScript. This timer helps you implement the Pomodoro Technique for improved productivity.

## Features

- **Focus & Break Timer**: 25-minute focus sessions with 5-minute breaks (configurable)
- **Visual State Indicators**: Clear visual distinction between focus and break modes
- **Timer Controls**: Start, pause, and reset functionality
- **Daily History**: Track completed focus sessions for the current day
- **Local Storage**: Sessions persist across page reloads
- **Responsive Design**: Works on mobile phones, tablets, and desktops
- **Accessibility**: Keyboard navigation, focus states, and screen reader support
- **Audio Notifications**: Sound plays when timer completes

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Running

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd pomodoro-timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Alternative: One-Command Setup
If you have Node.js installed, you can run:
```bash
npx create-react-app pomodoro-timer --template typescript && cd pomodoro-timer && npm start
```

## Deployment

The app is ready for deployment on any static hosting service:

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`

### GitHub Pages
1. Update `package.json` homepage field
2. Run: `npm run build && npm run deploy`

## Usage

1. **Set Durations**: Adjust focus and break times using the +/- buttons
2. **Start Timer**: Click "Start" to begin a focus session
3. **Take Breaks**: Timer automatically switches to break mode after focus
4. **Track Progress**: View completed sessions in the daily history
5. **Pause/Reset**: Use controls to pause or reset the timer anytime

## Project Structure

```
pomodoro-timer/
├── public/              # Static assets
├── src/
│   ├── App.tsx         # Main application component
│   ├── App.css         # Application styles
│   ├── index.tsx       # Entry point
│   └── index.css       # Global styles
├── README.md           # This file
├── ANSWERS.md          # Assessment answers
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT