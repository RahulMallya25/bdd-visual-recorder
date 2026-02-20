# Setup Instructions

## Installation Steps

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

Or use the shortcut:
```bash
npm run install:backend
```

3. Install Playwright browsers:
```bash
cd backend
npx playwright install
cd ..
```

## Running the Application

Start both frontend and backend:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:3001

## Usage

1. Open http://localhost:5173 in your browser
2. Enter Project Name, Scenario Name, and URL
3. Click "Launch" - a Playwright browser window will open
4. Add steps and click "Record" to capture interactions
5. Click "View" to see generated code
6. Click "Export" to generate the complete framework

## Troubleshooting

If the browser doesn't launch:
- Make sure Playwright browsers are installed: `cd backend && npx playwright install`
- Check backend console for errors
- Ensure port 3001 is not in use

If WebSocket connection fails:
- Check that backend is running on port 3001
- Check browser console for connection errors
