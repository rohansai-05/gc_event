const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("main");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/admin", (req, res) => {
    res.render("addAdmin");
});

app.get("/organiser", (req, res) => {
    res.render("addOrganiser");
});

app.get("/user", (req, res) => {
    res.render("addUser");
});

app.post("/adminsign", (req, res) => {
    const { username, password } = req.body;


    db.collection('admin-login').where("username", "==", username).where("password", "==", password).get()
        .then((snapshot) => {
            if (!snapshot.empty) {
                res.render("admin-home");
            } else {
                res.send("wrong credentials");
            }
        })
        .catch((error) => {
            console.error("Error retrieving user data: ", error);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/organisersignin", (req, res) => {
    const { username, password } = req.body;


    // Check if username and password are defined
    if (!username || !password) {
        return res.status(400).send("Username and password are required.");
    }

    db.collection('org-login').where("username", "==", username).where("password", "==", password).get()
        .then((snapshot) => {
            if (!snapshot.empty) {
                res.render("org-home");
            } else {
                res.send("wrong credentials");
            }
        })
        .catch((error) => {
            console.error("Error retrieving user data: ", error);
            res.status(500).send("Internal Server Error");
        });
});
app.post("/usersignin", (req, res) => {
    const { username, password } = req.body;


    db.collection('user-login').where("username", "==", username).where("password", "==", password).get()
        .then((snapshot) => {
            if (!snapshot.empty) {
                res.render("user-home");
            } else {
                res.send("wrong credentials");
            }
        })
        .catch((error) => {
            console.error("Error retrieving user data: ", error);
            res.status(500).send("Internal Server Error");
        });
});

// Route to add an admin
app.post("/addAdmin", (req, res) => {
    const { username, password } = req.body;

    db.collection('admin-login').add({
        username: username,
        password: password
    })
    .then(() => {
        res.send("Admin added successfully");
    })
    .catch((error) => {
        console.error("Error adding admin: ", error);
        res.status(500).send("Error adding admin");
    });
});

// Route to add an organizer
app.post("/addOrganiser", (req, res) => {
    const { username, password } = req.body;

    db.collection('org-login').add({
        username: username,
        password: password
    })
    .then(() => {
        res.send("Organizer added successfully");
    })
    .catch((error) => {
        console.error("Error adding organizer: ", error);
        res.status(500).send("Error adding organizer");
    });
});

// Route to add a user
app.post("/addUser", (req, res) => {
    const { username, password } = req.body;

    db.collection('user-login').add({
        username: username,
        password: password
    })
    .then(() => {
        res.send("User added successfully");
    })
    .catch((error) => {
        console.error("Error adding user: ", error);
        res.status(500).send("Error adding user");
    });
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
