#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ESP32Servo.h>
#include <SPIFFS.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

// Replace with network credentials
const char* ssid = "sfteam";
const char* password = "12345678";

// Create servo objects
Servo servo1;
Servo servo2;

// Motor control pins
const int MOTOR_LEFT_PIN1 = 26;  // Left motor control pin 1
const int MOTOR_LEFT_PIN2 = 27;  // Left motor control pin 2
const int MOTOR_RIGHT_PIN1 = 32; // Right motor control pin 1
const int MOTOR_RIGHT_PIN2 = 33; // Right motor control pin 2

// Servo pins
const int SERVO1_PIN = 13;
const int SERVO2_PIN = 12;

// PWM channels for motors
const int PWM_CHANNEL_LEFT1 = 0;
const int PWM_CHANNEL_LEFT2 = 1;
const int PWM_CHANNEL_RIGHT1 = 2;
const int PWM_CHANNEL_RIGHT2 = 3;

// PWM properties
const int PWM_FREQ = 5000;
const int PWM_RESOLUTION = 8;

// Create WebSocket server on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// Create web server on port 80
AsyncWebServer server(80);

void setup() {
    Serial.begin(115200);

    // Initialize SPIFFS
    if(!SPIFFS.begin(true)) {
        Serial.println("An error occurred while mounting SPIFFS");
        return;
    }

    // Configure motor pins
    ledcSetup(PWM_CHANNEL_LEFT1, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(PWM_CHANNEL_LEFT2, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(PWM_CHANNEL_RIGHT1, PWM_FREQ, PWM_RESOLUTION);
    ledcSetup(PWM_CHANNEL_RIGHT2, PWM_FREQ, PWM_RESOLUTION);
    
    ledcAttachPin(MOTOR_LEFT_PIN1, PWM_CHANNEL_LEFT1);
    ledcAttachPin(MOTOR_LEFT_PIN2, PWM_CHANNEL_LEFT2);
    ledcAttachPin(MOTOR_RIGHT_PIN1, PWM_CHANNEL_RIGHT1);
    ledcAttachPin(MOTOR_RIGHT_PIN2, PWM_CHANNEL_RIGHT2);

    // Attach servos
    servo1.attach(SERVO1_PIN);
    servo2.attach(SERVO2_PIN);

    // Set initial servo positions
    servo1.write(90);
    servo2.write(90);

    // Connect to Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("Connected to WiFi");
    Serial.println(WiFi.localIP());

    // Serve static files from SPIFFS
    server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html");
    
    // Start servers
    server.begin();
    webSocket.begin();
    webSocket.onEvent(onWebSocketEvent);
}

void loop() {
    webSocket.loop();
}

void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            Serial.printf("[%u] Disconnected!\n", num);
            break;
        case WStype_CONNECTED:
            {
                Serial.printf("[%u] Connected!\n", num);
            }
            break;
        case WStype_TEXT:
            {
                StaticJsonDocument<200> doc;
                DeserializationError error = deserializeJson(doc, payload);
                
                if (error) {
                    Serial.println("Failed to parse JSON");
                    return;
                }

                const char* type = doc["type"];
                
                if (strcmp(type, "servo") == 0) {
                    int servoNum = doc["servo"];
                    int angle = doc["angle"];
                    
                    if (servoNum == 1) {
                        servo1.write(angle);
                    } else if (servoNum == 2) {
                        servo2.write(angle);
                    }
                    
                    Serial.printf("Servo %d set to %d degrees\n", servoNum, angle);
                }
                else if (strcmp(type, "motor") == 0) {
                    int leftSpeed = doc["left"];
                    int rightSpeed = doc["right"];
                    
                    // Control left motor
                    if (leftSpeed >= 0) {
                        ledcWrite(PWM_CHANNEL_LEFT1, leftSpeed);
                        ledcWrite(PWM_CHANNEL_LEFT2, 0);
                    } else {
                        ledcWrite(PWM_CHANNEL_LEFT1, 0);
                        ledcWrite(PWM_CHANNEL_LEFT2, -leftSpeed);
                    }
                    
                    // Control right motor
                    if (rightSpeed >= 0) {
                        ledcWrite(PWM_CHANNEL_RIGHT1, rightSpeed);
                        ledcWrite(PWM_CHANNEL_RIGHT2, 0);
                    } else {
                        ledcWrite(PWM_CHANNEL_RIGHT1, 0);
                        ledcWrite(PWM_CHANNEL_RIGHT2, -rightSpeed);
                    }
                    
                    Serial.printf("Motors set to L: %d, R: %d\n", leftSpeed, rightSpeed);
                }
            }
            break;
    }
} 