function goToLogin() {
    window.location.href = "login.html";
}
const SUPABASE_URL = "https://ubeqncqjycwcgzvpoizz.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_OpJOCLf66koWUbQO0stmHA_036yJFG9";

let supabaseClient = null;

if (window.supabase) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
}
/* =========================
   SUPABASE LOGIN SYSTEM
   ========================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("loginMessage");

        message.textContent = "Signing in...";
        message.style.color = "#315D49";

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            message.textContent = "Invalid email or password.";
            message.style.color = "#A33A3A";
            return;
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

        if (profileError || !profile) {
            message.textContent = "Your account profile could not be found.";
            message.style.color = "#A33A3A";

            await supabase.auth.signOut();
            return;
        }

        localStorage.setItem(
            "nivaraUser",
            JSON.stringify(profile)
        );

        if (profile.role === "Administrator") {
            window.location.href = "admin.html";
        } else {
            message.textContent = "Your account is not assigned to a system dashboard yet.";
            message.style.color = "#A33A3A";
        }
    });
}


function logout() {

    localStorage.removeItem("nivaraUser");

    window.location.href = "index.html";

}
/* =========================
   USER MANAGEMENT
========================= */

const roleSelect = document.getElementById("newUserRole");

const doctorFields = document.getElementById("doctorFields");


if (roleSelect) {

    roleSelect.addEventListener("change", function() {

        if (this.value === "doctor") {

            doctorFields.style.display = "block";

        } else {

            doctorFields.style.display = "none";

        }

    });

}


/* =========================
   LOAD USERS
========================= */

function getUsers() {

    const storedUsers =
        localStorage.getItem("nivaraUsers");

    if (storedUsers) {

        return JSON.parse(storedUsers);

    }


    const defaultUsers = [

        {
            name: "Nivara Administrator",
            username: "admin",
            role: "Administrator",
            department: "Administration",
            status: "Active"
        },

        {
            name: "Dr. Leena",
            username: "drleena",
            role: "Doctor",
            department: "Dermatology",
            status: "Active"
        }

    ];


    localStorage.setItem(
        "nivaraUsers",
        JSON.stringify(defaultUsers)
    );


    return defaultUsers;

}


/* =========================
   DISPLAY USERS
========================= */

function displayUsers() {

    const table =
        document.getElementById("usersTable");

    if (!table) return;


    const users = getUsers();

    table.innerHTML = "";


    users.forEach(function(user) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${user.name}
            </td>

            <td>
                ${user.username}
            </td>

            <td>
                ${user.role}
            </td>

            <td>
                ${user.department || "-"}
            </td>

            <td>
                <span class="status completed">
                    ${user.status}
                </span>
            </td>

        `;

        table.appendChild(row);

    });

}


/* =========================
   CREATE USER
========================= */

const createUserForm =
    document.getElementById("createUserForm");


if (createUserForm) {

    displayUsers();


    createUserForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById("newUserName").value.trim();

            const username =
                document.getElementById("newUsername").value.trim();

            const password =
                document.getElementById("newPassword").value;

            const role =
                document.getElementById("newUserRole").value;


            let department = "";

            let specialization = "";

            let doctorId = "";


            if (role === "doctor") {

                department =
                    document.getElementById("department").value;

                specialization =
                    document.getElementById("specialization").value;

                doctorId =
                    document.getElementById("doctorId").value;

            }


            const users = getUsers();


            const usernameExists =
                users.some(function(user) {

                    return user.username === username;

                });


            if (usernameExists) {

                document.getElementById(
                    "userMessage"
                ).textContent =
                    "That username already exists.";

                document.getElementById(
                    "userMessage"
                ).style.color = "#A33A3A";

                return;

            }


            const newUser = {

                name: name,

                username: username,

                password: password,

                role: role,

                department: department,

                specialization: specialization,

                doctorId: doctorId,

                status: "Active"

            };


            users.push(newUser);


            localStorage.setItem(
                "nivaraUsers",
                JSON.stringify(users)
            );


            displayUsers();


            document.getElementById(
                "userMessage"
            ).textContent =
                "User created successfully.";

            document.getElementById(
                "userMessage"
            ).style.color = "#315D49";


            createUserForm.reset();

            doctorFields.style.display = "none";

        }
    );

}

