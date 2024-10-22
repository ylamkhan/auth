document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm-password').value;

    registerUser(email, password, first_name, last_name);
});

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

        if (response.ok) {
            loginUser(email, password);
        } else {
            console.error("Registration failed", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};



const loginUser = async (email, password) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = "/dashboard/";
        } else {
            console.error("Login failed", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};


