# React Native Computer Vision

Mobile computer-vision demo app built with Expo + React Native.

It includes on-device AI demos powered by `react-native-executorch`, plus a real-time camera pipeline using `react-native-vision-camera`.

## Features

- Real-time Vision Camera screen with model/task switching
- Image demos for:
  - Object Detection
  - OCR
  - OCR Vertical
- Vision camera task variants:
  - Classification
  - Object Detection (SSDLite / RF-DETR / YOLO26N)
  - Segmentation (DeepLab / FCN / LRASPP / Selfie)
  - Instance Segmentation
  - OCR
  - Style Transfer

## Tech Stack

- Expo SDK 54
- React Native 0.81.5
- Expo Router (file-based navigation)
- React Native Vision Camera
- React Native Worklets
- React Native ExecuTorch

## Prerequisites

- Node.js LTS
- Yarn 1.x
- Xcode + CocoaPods (for iOS)
- Android Studio + SDK (for Android)

## Install

```bash
yarn install
```

## Run

### iOS (recommended for this project)

```bash
yarn ios
```

### Android

```bash
yarn android
```

### Metro / Dev server

```bash
yarn start
```

## Important Notes

- This app uses native modules (`react-native-executorch`, `react-native-vision-camera`, `react-native-nitro-modules`), so use a **development build**.
- **Do not use Expo Go** for full functionality.
- Camera permission is required (configured via `NSCameraUsageDescription` in [app.json](app.json)).

## Project Structure

- [app](app) – routes/screens
- [app/vision_camera/index.tsx](app/vision_camera/index.tsx) – real-time camera + model switching UI
- [components/vision_camera/tasks](components/vision_camera/tasks) – per-task camera processing components
- [assets](assets) – model files (`.pte`) and app assets

## Scripts

- `yarn start` – start Expo dev server
- `yarn ios` – run iOS dev build
- `yarn android` – run Android dev build
- `yarn web` – run web target
- `yarn lint` – lint project

## Troubleshooting

### iOS build fails after dependency changes

```bash
cd ios && pod install
```

Then rerun:

```bash
yarn ios
```

### VisionCamera / Worklets C++ errors

Make sure `react-native-worklets` is on a compatible version (`0.8.1` in this project) and reinstall pods.

### Watchman recrawl warning

```bash
watchman watch-del '/Users/minhazhe/Documents/react-native-computer-vision'
watchman watch-project '/Users/minhazhe/Documents/react-native-computer-vision'
```

## License

Private project.
