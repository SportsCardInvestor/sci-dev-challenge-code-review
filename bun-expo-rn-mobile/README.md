# Star Wars Unlimited Card Database App

A React Native mobile application built with Expo and Bun for browsing Star Wars Unlimited cards. This project features seamless API integration with SWUDB.com for up-to-date card information.

## Features

- Browse and search Star Wars Unlimited cards by cost
- View detailed card information including images, stats, and text
- Mobile-friendly interface with modern React Native components
- Seamless CORS proxy integration for API requests

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/) (recommended)
- Expo CLI

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/swu-card-app.git
   cd swu-card-app
   ```

2. Install dependencies
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install
   ```

3. Start the development server
   ```bash
   # Using Bun
   bun start

   # Or using npm
   npm start
   ```

4. Open the app on your device using Expo Go or run on a simulator/emulator

### Running the App

After starting the development server, you have several options:

- Scan the QR code with the Expo Go app on your physical device
- Press `a` to open on an Android emulator
- Press `i` to open on an iOS simulator
- Press `w` to open in a web browser

### Development Commands

```bash
# Start the development server
bun start

# Start on specific platform
bun run android
bun run ios
bun run web

# Lint the codebase
bun run lint

# Reset project to clean slate
bun run reset-project
```

## Project Structure

- `app/` - Main application screens and navigation (Expo Router)
- `components/` - Reusable UI components
- `api/` - API client for SWUDB integration and type definitions
- `constants/` - App-wide constants and configuration
- `hooks/` - Custom React hooks
- `assets/` - Static assets including images and fonts

## Technologies Used

- [React Native](https://reactnative.dev/) (v0.79.2) - Mobile application framework
- [Expo](https://expo.dev/) (v53.0.9) - React Native development platform
- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [TypeScript](https://www.typescriptlang.org/) - Type safety and developer experience
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing for Expo apps
- [CORS Proxy](https://corsproxy.io/) - Handle cross-origin requests to the SWUDB API
This is a React Native mobile app for Sports Card Investor, built with Expo and Bun.

## Features

- Browse and filter cards based on health points (HP)
- Sort cards by name, set, cost, or power
- View detailed card information with images

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Expo CLI

### Installation

1. Install dependencies

```bash
# Using npm
npm install

# OR using Bun
bun install
```

2. Start the development server

```bash
# Using npm
npm start

# OR using Bun
bun run start
```

3. Open the app on your device using the Expo Go app or run it in a simulator

## Project Structure

- `/api` - API client and data types
- `/app` - App screens and navigation
- `/components` - Reusable UI components
- `/constants` - App constants and configuration
- `/hooks` - Custom React hooks

## API Integration

The application integrates with the Star Wars Unlimited Database (SWUDB) API to fetch card information:

- **Base URL**: https://swudb.com/api
- **CORS Handling**: The app uses a CORS proxy (corsproxy.io) to handle cross-origin requests
- **Fallback Data**: Mock card data is generated if the API is unavailable

### Available Endpoints

- **Catalog**: Fetch available card costs (0-15)
- **Card Search**: Search cards by cost

## License

This project is proprietary and confidential.
This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
