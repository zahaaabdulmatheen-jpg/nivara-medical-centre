function goToLogin() {
    window.location.href = "login.html";
}


/* =========================
   DEMO LOGIN SYSTEM
========================= */

const demoUsers = [
    {
        username: "admin",
        password: "admin123",
        role: "admin",
        name: "Nivara Administrator"
    },

    {
        username: "drleena",
        password: "doctor123",
        role: "doctor",
        name: "Dr. Leena"
    }
];


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("loginMessage");


        const user = demoUsers.find(function(account) {

            return (
                account.username === username &&
                account.password === password
            );

        });


        if (user) {

            localStorage.setItem(
                "nivaraUser",
                JSON.stringify(user)
            );


            if (user.role === "admin") {

                window.location.href = "admin.html";

            } else if (user.role === "doctor") {

                window.location.href = "doctor.html";

            }

        } else {

            message.textContent =
                "Incorrect username or password.";

            message.style.color = "#A33A3A";

        }

    });

}
function logout() {

    localStorage.removeItem("nivaraUser");

    window.location.href = "index.html";

}
