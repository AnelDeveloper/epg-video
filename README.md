# EPG Media Player

A responsive, single-page TV interface featuring an Electronic Program Guide (EPG) with background video player support, built with React, TypeScript, and Zustand.

## Features

### Core Requirements
- ✅ XML EPG data fetching and parsing from tvprofil.net
- ✅ Three vertical lists: Date Picker, Channel List, and EPG List
- ✅ State management with Zustand
- ✅ Empty state handling for dates with no data
- ✅ Custom React hooks for logic separation
- ✅ Responsive UI with Tailwind CSS

### Bonus Features
- ✅ **Level 1**: Background video player with Widevine DRM support
- ✅ **Level 2**: Interactive channel switching with 3 DRM-protected streams
- ✅ **Level 3**: Legacy browser compatibility (Chromium 20-30) and auto-recovery mechanism

## Tech Stack

- **React 18** (Functional Components)
- **TypeScript**
- **Webpack 5** (with Babel for ES5 compatibility)
- **Zustand** (State Management)
- **Tailwind CSS** (Styling)
- **Shaka Player** (DRM Video Playback)

## Project Structure

```
EPG/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DatePicker.tsx
│   │   ├── ChannelList.tsx
│   │   ├── EPGList.tsx
│   │   └── VideoPlayer.tsx
│   ├── hooks/
│   │   ├── useEPGData.ts
│   │   └── useFilteredPrograms.ts
│   ├── store/
│   │   ├── epgStore.ts
│   │   └── playerStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── xmlParser.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── webpack.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

or

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
```

The production build will be generated in the `dist/` directory.

## Usage

1. **Loading EPG Data**: The application automatically fetches EPG data from `https://tvprofil.net/xmltv/data/epg_tvprofil.net.xml` on startup. If CORS issues occur, it will attempt to use a CORS proxy.

2. **Date Selection**: Click on a date in the left panel to view programs for that date.

3. **Channel Selection**: Click on a channel in the middle panel to view its programs and switch the background video stream.

4. **Program Selection**: Click on a program in the right panel to view details.

5. **Video Playback**: The background video player automatically switches streams when you select different channels. It supports:
   - Widevine DRM playback
   - Auto-recovery on errors (up to 3 attempts)
   - Legacy browser compatibility

## Implementation Details

### XML Parsing
- Client-side XML parsing using the native `DOMParser`
- Data normalization to link Programs to Channels
- Automatic date extraction and sorting

### State Management
- **EPG Store**: Manages channels, programs, dates, and user selections
- **Player Store**: Manages video player state, stream URLs, and recovery attempts

### Legacy Browser Support
- Babel configuration targets Chromium 20-30
- ES5-compatible output with polyfills via core-js
- No arrow functions in compiled output
- Promise polyfills included

### Auto-Recovery Mechanism
- Automatically retries playback on errors
- Maximum of 3 recovery attempts
- 2-second delay between attempts
- Resets recovery counter on successful stream switch

## Stream URLs

The application uses the following test streams:

1. **Angel One**: `https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8`
2. **Tears of Steel**: `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`
3. **Big Buck Bunny**: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

Default DRM stream: `https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd`

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Legacy browsers: Chromium 20-30 (with polyfills)

## Troubleshooting

### CORS Issues
If you encounter CORS issues when fetching EPG data:
1. The application automatically tries a CORS proxy as a fallback
2. Alternatively, download the XML file and place it in the `public/` folder as `epg_tvprofil.net.xml`
3. Modify `src/hooks/useEPGData.ts` to use the local file:
   ```typescript
   const EPG_URL = '/epg_tvprofil.net.xml'; // Use local file
   ```

### Video Playback Issues
- Ensure your browser supports Widevine DRM
- Check browser console for detailed error messages
- The player will automatically attempt recovery on errors

## Development Notes

- All code is written in TypeScript with strict type checking
- Functional components with React Hooks
- ES5-compatible output for legacy browser support
- Modular architecture with clear separation of concerns

## License

This project is created for assessment purposes.

