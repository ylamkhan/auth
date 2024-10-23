async function loadPage(page) {
    const content = document.getElementById('content');

    try {
        const response = await fetch(`pages/${page}.html`);
        if (!response.ok) {
            throw new Error('Page not found');
        }
        const htmlContent = await response.text();
        content.innerHTML = htmlContent;

        // Attach event listeners after the page is loaded
        if (page === 'register') {
            setupCanvas(); // Initialize the canvas
            attachRegisterFormListener();
        } else if (page === 'login') {
            attachLoginFormListener();
        } else if (page === 'home') {
            displayUsername();
        }
    } catch (error) {
        content.innerHTML = '<p>Error loading page.</p>';
        console.error(error);
    }
}

// Attach event listener for the register form
function attachRegisterFormListener() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const first_name = document.getElementById('first_name').value;
            const last_name = document.getElementById('last_name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirm_password = document.getElementById('confirm-password').value;

            if (password !== confirm_password) {
                document.getElementById('register-message').textContent = 'Passwords do not match!';
                return;
            }

            // Call the registerUser function
            registerUser(email, password, confirm_password, first_name, last_name);
        });
    }
}

// Attach event listener for the login form
function attachLoginFormListener() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Call the loginUser function
            loginUser(email, password);
        });
    }
}

// Display username on home page
function displayUsername() {
    const username = localStorage.getItem('currentUser');
    if (username) {
        document.getElementById('username-display').textContent = username;
        document.getElementById('logout').addEventListener('click', logoutUser);
    }
}

// Function to setup canvas
function setupCanvas() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match CSS size
    canvas.width = 700; // Fixed width for canvas
    canvas.height = 700; // Fixed height for canvas

    const balls = [];
    const numBalls = 20;

    function createBall() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 15,
            speedX: (Math.random() * 6) + 2,
            speedY: (Math.random() * 6) + 2  
        };
    }
    
    for (let i = 0; i < numBalls; i++) {
        balls.push(createBall());
    }

    function drawBalls() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Define an array of colors
        const colors = ['#fff', '#058505', '#ff0000', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ff8000'];
        
        balls.forEach((ball, i) => {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = colors[i % colors.length]; // Cycle through the colors
            ctx.fill();
            ctx.closePath();
        });
    }

    function moveBalls() {
        balls.forEach(ball => {
            ball.x += ball.speedX;
            ball.y += ball.speedY;

            // Bounce off the walls
            if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
                ball.speedX = -ball.speedX;
            }
            if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
                ball.speedY = -ball.speedY;
            }
        });

        drawBalls();
        requestAnimationFrame(moveBalls);
    }

    moveBalls();

    window.addEventListener('resize', () => {
        canvas.width = 700; // Maintain fixed width on resize
        canvas.height = 700; // Maintain fixed height on resize
    });
}

// Register user function
const registerUser = async (email, password, confirm_password, first_name, last_name) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password1: password,
                password2: confirm_password,
                first_name: first_name,
                last_name: last_name
            })
        });

        const data = await response.json();
        console.log("Registration response data:", data);

        if (response.ok) {
            console.log("Registration successful. Logging in...");
            await loginUser(email, password); // Await the login before moving forward
            console.log("Redirecting to dashboard...");
            // Uncomment to redirect to dashboard after registration
            // window.location.href = "/dashboard/";
        } else {
            console.error("Registration failed:", data);
            document.getElementById('register-message').textContent = 'Registration failed. ' + data.non_field_errors.join(', ');
        }
    } catch (error) {
        console.error("Error during registration:", error);
        document.getElementById('register-message').textContent = 'Error during registration. Please try again.';
    }
};

// Logout function
function logoutUser() {
    localStorage.removeItem('currentUser');
    loadPage('login');  // Redirect to login page after logout
}

// Attach event listeners for navigation links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (event) => {
            const page = event.target.getAttribute('data-page');
            loadPage(page);
        });
    });

    // Load register page by default
    loadPage('register');
});
