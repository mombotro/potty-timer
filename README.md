# Potty Training Timer

A fun, interactive potty training timer application for toddlers built with React, Vite, and Pico CSS.

## Features

- Customizable timer intervals (45, 30, 15, 5 minutes)
- Custom time input option
- Star reward system
- Interactive "potty time" alarm with animations
- Sound effects for all interactions
- Mobile-friendly design

## How to Use

1. Select a time interval (45, 30, 15, or 5 minutes) or set a custom time
2. Press the Play button to start the timer
3. When the timer expires, an alarm will sound and the potty screen will appear
4. Click "Success!" if the potty attempt was successful (adds a star) or "Try Again" to reset the timer (with a shorter interval)
5. The star counter in the top-right corner keeps track of successful attempts

## Demo

View the live demo: [Potty Timer](https://mombotro.github.io/potty-timer/)

## Technologies Used

- React
- Vite
- Pico CSS (minimal, semantic CSS framework)
- Lucide React for icons
- Web Audio API for sound effects
- GitHub Pages for deployment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/[your-github-username]/potty-timer.git
cd potty-timer
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Customization

- Edit the `animations.css` file to change animations
- Modify the hooks in the `hooks` directory to change behavior
- Update components in the `components` directory to change UI

## License

MIT