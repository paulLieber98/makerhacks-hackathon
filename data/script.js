class JoystickController {
    constructor() {
        // Initialize joystick elements
        this.joystickArea = document.getElementById('joystick-area');
        this.joystickThumb = document.getElementById('joystick-thumb');
        this.xValue = document.getElementById('x-value');
        this.yValue = document.getElementById('y-value');
        
        // Initialize servo controls
        this.servoSliders = [
            document.getElementById('servo1'),
            document.getElementById('servo2')
        ];
        
        this.servoValues = [
            document.getElementById('servo1-value'),
            document.getElementById('servo2-value')
        ];
        
        this.centerX = 0;
        this.centerY = 0;
        this.active = false;
        this.maxDistance = 75;

        // Initialize WebSocket connection
        this.ws = null;
        this.connectWebSocket();

        this.init();
        this.initServoControls();
    }

    connectWebSocket() {
        // Get the current hostname (IP address) of the ESP32
        const host = window.location.hostname;
        // WebSocket port (ESP32 typically uses port 81 for WebSocket)
        this.ws = new WebSocket(`ws://${host}:81`);
        
        this.ws.onopen = () => {
            console.log('Connected to ESP32');
            this.joystickThumb.style.backgroundColor = '#4CAF50';
        };
        
        this.ws.onclose = () => {
            console.log('Disconnected from ESP32');
            this.joystickThumb.style.backgroundColor = '#ff4444';
            // Try to reconnect after 2 seconds
            setTimeout(() => this.connectWebSocket(), 2000);
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            this.joystickThumb.style.backgroundColor = '#ff4444';
        };

        this.ws.onmessage = (event) => {
            console.log('Received:', event.data);
        };
    }

    initServoControls() {
        // Add event listeners for all servo sliders
        this.servoSliders.forEach((slider, index) => {
            slider.addEventListener('input', () => {
                this.servoValues[index].textContent = `${slider.value}°`;
                this.sendServoCommand(index + 1, parseInt(slider.value));
            });
        });
    }

    setServo(servoNumber, angle) {
        const index = servoNumber - 1;
        this.servoSliders[index].value = angle;
        this.servoValues[index].textContent = `${angle}°`;
        this.sendServoCommand(servoNumber, angle);
    }

    sendServoCommand(servoNumber, angle) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const command = {
                type: 'servo',
                servo: servoNumber,
                angle: angle
            };
            this.ws.send(JSON.stringify(command));
            console.log('Sent servo command:', command);
        }
    }

    // Joystick control methods
    init() {
        ['mousedown', 'touchstart'].forEach(eventType => {
            this.joystickArea.addEventListener(eventType, (e) => this.startMove(e));
        });

        ['mousemove', 'touchmove'].forEach(eventType => {
            document.addEventListener(eventType, (e) => this.move(e));
        });

        ['mouseup', 'touchend'].forEach(eventType => {
            document.addEventListener(eventType, () => this.endMove());
        });

        const rect = this.joystickArea.getBoundingClientRect();
        this.centerX = rect.left + rect.width / 2;
        this.centerY = rect.top + rect.height / 2;

        window.addEventListener('resize', () => {
            const rect = this.joystickArea.getBoundingClientRect();
            this.centerX = rect.left + rect.width / 2;
            this.centerY = rect.top + rect.height / 2;
        });
    }

    startMove(e) {
        this.active = true;
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
    }

    move(e) {
        if (!this.active) return;

        e.preventDefault();

        const pointer = e.type.includes('mouse') ? e : e.touches[0];
        const rect = this.joystickArea.getBoundingClientRect();
        
        let dx = pointer.clientX - (rect.left + rect.width / 2);
        let dy = pointer.clientY - (rect.top + rect.height / 2);

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.maxDistance) {
            dx = (dx / distance) * this.maxDistance;
            dy = (dy / distance) * this.maxDistance;
        }

        this.joystickThumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

        const normalizedX = parseFloat((dx / this.maxDistance).toFixed(2));
        const normalizedY = parseFloat((dy / this.maxDistance).toFixed(2));

        this.xValue.textContent = normalizedX;
        this.yValue.textContent = normalizedY;

        this.sendMovementCommand(normalizedX, normalizedY);
    }

    endMove() {
        if (!this.active) return;
        
        this.active = false;
        this.joystickThumb.style.transform = 'translate(-50%, -50%)';
        
        this.xValue.textContent = '0';
        this.yValue.textContent = '0';
        
        this.sendMovementCommand(0, 0);
    }

    sendMovementCommand(x, y) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            // Convert joystick x,y (-1 to 1) to motor speeds (-255 to 255)
            const left = Math.round((y - x) * 255);
            const right = Math.round((y + x) * 255);
            
            const command = {
                type: 'motor',
                left: Math.max(-255, Math.min(255, left)),
                right: Math.max(-255, Math.min(255, right))
            };
            
            this.ws.send(JSON.stringify(command));
            console.log('Sent motor command:', command);
        }
    }
}

// Make controller globally accessible for button onclick handlers
let controller;

// Initialize the controller when the page loads
document.addEventListener('DOMContentLoaded', () => {
    controller = new JoystickController();
}); 