# ESP32 Robot Controller

Web-based interface for controlling an ESP32 robot with two servos and differential drive motors.

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

## Connections
### Servos
- Servo 1: GPIO 13
- Servo 2: GPIO 12

### Motors
- Left Motor: GPIO 26 (FWD), GPIO 27 (BWD)
- Right Motor: GPIO 32 (FWD), GPIO 33 (BWD)

## Required Libraries
- ESP32Servo
- WebSocketsServer
- ESPAsyncWebServer
- ArduinoJson
- SPIFFS

## Setup
1. Install required libraries in Arduino IDE
2. Set WiFi credentials in esp32_robot_controller.ino:
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```
3. Upload code to ESP32
4. Connect to same WiFi network
5. Open browser and navigate to ESP32's IP address (shown in Serial Monitor)

## Controls
- Joystick: Robot movement
- Sliders: Servo positions (0-180°)
- Preset buttons: Common servo positions

## Troubleshooting
- No WiFi connection: Check credentials and ESP32 range
- Servos not working: Check power and pin connections
- Motors not responding: Verify motor driver connections and power
