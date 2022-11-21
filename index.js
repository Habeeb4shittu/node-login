const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const mysql = require('mysql')
const { connect } = require('http2')
const app = express()
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "node_login"
})
app.use(express.static(path.resolve("public")))
app.use(bodyParser.urlencoded({ extended: true }))


app.set('view engine', 'ejs')
app.get("/", (req, res) => {
    res.render("index")
})

app.post("/", [
    check("firstname")
        .isLength({ min: 3 }).withMessage('Lenght Must be more than 3')
        .notEmpty()
        .withMessage("Firstname is required"),
    check("lastname")
        .notEmpty()
        .withMessage("Lastname is required"),
    check("email")
        .isEmail()
        .withMessage("Email is required")
        .normalizeEmail(),
    check("gender")
        .notEmpty()
        .withMessage("Gender is required"),
    check("password")
        .notEmpty()
        .isLength({ min: 4, max: 12 })
        .withMessage("Password must be between 4 and 12 characters")
        .custom((val, { req }) => val === req.body.conpassword)
        .withMessage("Password Mismatch"),
    check("conpassword")
        .notEmpty()
        .custom((val, { req }) => val === req.body.password)
        .withMessage("Password Mismatch")
], (req, res) => {
    let success = ""
    let errors = firstname = lastname = email = password = gender = conpassword = ""
    firstname = req.body.firstname
    lastname = req.body.lastname
    email = req.body.email
    gender = req.body.gender
    password = req.body.password
    conpassword = req.body.conpassword
    if (!validationResult(req).isEmpty()) {
        errors = validationResult(req).errors
        res.render('index', { errors, firstname, lastname, email, gender, password, conpassword })
        return
    }
    success = "Successful"
    con.connect((err) => {
        if (err) throw err;
        console.log("Connected");
        let sql = `INSERT INTO users(firstname, lastname, email, gender, password) VALUES('${firstname}', '${lastname}', '${email}', '${gender}', '${password}')`
        con.query(sql, function (err) {
            if (err) throw err;
            console.log("Successful");
        });
    })
    res.render("login", { success, firstname, lastname, email, gender, password, conpassword })
})


app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', [
    check("email")
        .notEmpty()
        .withMessage("Email cannot be empty")
        .normalizeEmail(),
    check("password")
        .notEmpty()
        .withMessage("Password cannot be Empty")
], (req, res) => {
    let errors = email = password = success = ""
    email = req.body.email
    password = req.body.password
    if (!validationResult(req).isEmpty()) {
        errors = validationResult(req).errors
        res.render('login', { errors, email, password })
        return
    }
    success = ""
    if (email === "habeeb4shittu@gmail.com" && password === "123456789") {
        res.redirect("/users")
    } else {
        error = "Incorrect Details"
        res.render("login", { error })
    }

})
app.get("/users", (req, res) => {
    // con.connect((err) => {
    // if (err) throw err;
    // console.log("successful");
    con.query(`SELECT * FROM users`, (err, result) => {
        if (err) throw err;
        res.render("users", { result })
    })
    // })
})
app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    // con.connect((err) => {
    //     if (err) throw err;
    //     console.log("successful");
    con.query(`SELECT * FROM users WHERE id = '${id}'`, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json({ result })
    })
    // })
})
app.listen(process.env.PORT || 3030, () => {
    console.log("Working")
})
