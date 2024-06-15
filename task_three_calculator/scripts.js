// Function to clear the display
function clr() {
    document.getElementById("result").value = "";
}

// Function to delete the last character from the display
function delLast() {
    let current = document.getElementById("result").value;
    document.getElementById("result").value = current.slice(0, -1);
}

// Function to display value
function dis(val) {
    document.getElementById("result").value += val;
}

// Function to evaluate the expression and return the result
function solve() {
    try {
        let x = document.getElementById("result").value;
        let y = math.evaluate(x);
        document.getElementById("result").value = y;
    } catch (err) {
        document.getElementById("result").value = "Error";
    }
}

// Handle keydown event for inputs
document.addEventListener("keydown", function(event) {
    let key = event.key;
    if (key >= '0' && key <= '9' || key === '+' || key === '-' || key === '*' || key === '/' || key === '.') {
        dis(key);
    } else if (key === 'Enter') {
        solve();
    } else if (key === 'Backspace') {
        delLast();
    } else if (key === 'Escape') {
        clr();
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const result = document.getElementById("result");

    // Ensure the input scrolls to the rightmost side
    result.addEventListener('input', function() {
        result.scrollright = result.scrollWidth;
    });
});
const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const symbols = ['=', '-', '+','?']; // Mathematical symbols
    const lim=canvas.height<canvas.width ? canvas.height : canvas.width;
    

    let symbolsArray = [];

    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function getRandomSize() {
        return Math.random() *( lim*0.5); // Dynamic size based on canvas width
    }

    function createSymbol() {
        const symbol = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: getRandomSize(),
            speedX: Math.random() * 2 - 1, // Random speed between -1 and 1
            speedY: Math.random() * 2 - 1,
            spinSpeed: Math.random() * 0.1 - 0.05, // Random spin speed between -0.05 and 0.05
            rotation: Math.random() * Math.PI * 2, // Random initial rotation angle
            symbol: getRandomSymbol(),
            visible: true
        };
        symbolsArray.push(symbol);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < symbolsArray.length; i++) {
            const symbol = symbolsArray[i];

            if (symbol.visible) {
                ctx.save();
                ctx.fillStyle = 'green'; 
                ctx.font = symbol.size + 'px Arial';
                ctx.translate(symbol.x, symbol.y);
                ctx.rotate(symbol.rotation);
                ctx.fillText(symbol.symbol, -symbol.size / 2, symbol.size / 2); // Adjust position for centering
                ctx.restore();
            }

            symbol.x += symbol.speedX;
            symbol.y += symbol.speedY;
            symbol.rotation += symbol.spinSpeed; // Increment rotation angle

            // Bounce off edges
            if (symbol.x <= 0 || symbol.x >= canvas.width) {
                symbol.speedX *= -1;
            }
            if (symbol.y <= 0 || symbol.y >= canvas.height) {
                symbol.speedY *= -1;
            }

            // Boundary check
            if (symbol.x < -symbol.size || symbol.x > canvas.width + symbol.size || symbol.y < -symbol.size || symbol.y > canvas.height + symbol.size) {
                symbol.visible = false;
            }

            // Check collision with other symbols
            for (let j = i + 1; j < symbolsArray.length; j++) {
                const otherSymbol = symbolsArray[j];
                const dx = symbol.x - otherSymbol.x;
                const dy = symbol.y - otherSymbol.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < (symbol.size + otherSymbol.size) / 2) {
                    if (symbol.size > otherSymbol.size) {
                        otherSymbol.visible = false;
                    } else {
                        symbol.visible = false;
                    }
                }
            }
        }

        // Remove invisible symbols
        symbolsArray = symbolsArray.filter(symbol => symbol.visible);

        // Add new symbols to maintain equilibrium
        if (symbolsArray.length < 50) {
            createSymbol();
        }

        requestAnimationFrame(update);
    }

    // Resize canvas to fit window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);

    // Initialize
    resizeCanvas();
    for (let i = 0; i < 50; i++) {
        createSymbol();
    }
    update();