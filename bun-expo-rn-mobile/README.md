# Welcome to your Expo app 👋
# Sports Card Investor Mobile App
# Sports Card Investor Mobile App

This is a React Native mobile app for Sports Card Investor, built with Expo and Bun.

## Features

- Browse and filter cards based on health points (HP)
- Sort cards by name, set, cost, or power
- View detailed card information with images

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- Bun or npm
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/sports-card-investor.git
   cd sports-card-investor
   ```

2. Install dependencies
   ```
   bun install
   # or
   npm install
   ```

3. Start the development server
   ```
   bun start
   # or
   npm start
   ```

4. Open the app on your device using Expo Go or run on a simulator/emulator

## Project Structure

- `app/` - Main application screens and navigation
- `components/` - Reusable UI components
- `api/` - API client and types
- `constants/` - App-wide constants
- `hooks/` - Custom React hooks
- `assets/` - Static assets

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
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

## Known Issues

- The app requires a local proxy server running on port 8010 to handle CORS for API requests
- You can start the proxy using the local-cors-proxy package: `npx local-cors-proxy --port 8010 --proxyUrl https://api.sportsinvestor.com`

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
