# ESP32 Robot Controller

A web interface to control an ESP32 robot with servos and motors.

## Setup Steps (IN ORDER)

### 1. Install Software
- Download & install [Arduino IDE](https://www.arduino.cc/en/software)
- Add ESP32 board support:
  ```
  File > Preferences > Additional Board URLs:
  https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
  ```
- Install board: Tools > Board > Boards Manager > search "ESP32" > Install

### 2. Install Libraries
Tools > Manage Libraries > Install each:
- ESP32Servo
- WebSocketsServer
- ESPAsyncWebServer
- ArduinoJson
- AsyncTCP

### 3. Set Board Settings
Tools > Board > ESP32 Arduino > ESP32 Dev Module
- Upload Speed: 115200
- Port: Select your COM port

### 4. Change WiFi Settings
In esp32_robot_controller.ino change:
```cpp
const char* ssid = "HOTSPOT_NAME";      // Your hotspot name
const char* password = "HOTSPOT_PASS";   // Your hotspot password
```

### 5. Upload Files (IMPORTANT ORDER!)
1. First: Tools > ESP32 Sketch Data Upload
2. Then: Upload main code (Upload button)
3. Open Serial Monitor to see IP address
4. Connect to hotspot and open IP in browser

## Pin Connections
- Servo 1: GPIO 13
- Servo 2: GPIO 12
- Left Motor: GPIO 26 (FWD), 27 (BWD)
- Right Motor: GPIO 32 (FWD), 33 (BWD)

## Controls
- Joystick = Movement
- Sliders = Servo angles
- Buttons = Preset positions

## Common Issues
- No upload port? Check USB cable and drivers
- Can't connect? Verify hotspot credentials
- No web interface? Repeat upload steps in correct order
- Motors/servos not responding? Check pin connections

## Features
- Real-time joystick control for movement
- Two servo motor controls (0-180°)
- Responsive web interface
- Automatic reconnection
- Real-time position feedback

## Hardware
- ESP32 Development Board
- 2x Servo Motors
- 2x DC Motors
- Motor Driver (L298N or similar)
- Power Supply
- USB Cable

## Required Libraries
- ESP32Servo
- WebSocketsServer
- ESPAsyncWebServer
- ArduinoJson
- SPIFFS

## Setup
1. Install Arduino IDE and ESP32 board support
2. Install required libraries in Arduino IDE
3. Install ESP32 Sketch Data Upload Tool:
   - Download from: https://github.com/me-no-dev/arduino-esp32fs-plugin/releases/
   - Copy to Arduino/tools/ESP32FS/tool/esp32fs.jar
   - Restart Arduino IDE

4. Prepare the web files:
   - Create a 'data' folder in your sketch folder
   - Copy index.html, styles.css, and script.js into the 'data' folder
   - Use "ESP32 Sketch Data Upload" tool from Arduino IDE Tools menu

5. Set WiFi credentials in esp32_robot_controller.ino:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

6. Upload main code to ESP32
7. Connect to same WiFi network
8. Open browser and navigate to ESP32's IP address (shown in Serial Monitor)

## Controls
- Joystick: Robot movement
- Sliders: Servo positions (0-180°)
- Preset buttons: Common servo positions

## Troubleshooting
- No WiFi connection: Check credentials and ESP32 range
- Servos not working: Check power and pin connections
- Motors not responding: Verify motor driver connections and power
- Web interface not loading: Make sure SPIFFS files were uploaded correctly
- Can't upload SPIFFS: Install ESP32 Sketch Data Upload tool and verify data folder structure

## File Structure
```
esp32-robot-controller/
├── esp32_robot_controller.ino
├── data/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── README.md
└── LICENSE
```

## License
MIT License - See LICENSE file for details
