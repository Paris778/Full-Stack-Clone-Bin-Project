// Set up a server

//Run server > npm run devStart

const express = require('express')
const app = express()
app.set('view engine', 'ejs') //Set view angine to EJS
app.use(express.static('public')) //Tell server that everything in public directory will be used definitely
app.use(express.urlencoded({ extended: true }))

// Database
const Document = require('./models/Document')
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/clonebin_db", { useUnifiedTopology: true, useNewUrlParser: true })

// Take a response and a request and this is how we send info to our server
app.get('/', (req, res) => {

    const code = `Welcome to CodeBin
    
Use the commands in the top right
to create new file to share with others.`

    //Render a file from inside views folder
    // Second parameter is to send to client (key value pair , or variable)
    // This code variable is passed into the EJS file and inserted into where the code should be
    res.render('code-display', { code, language: "plaintext" })
})

app.get("/new", (req, res) => {
    res.render("new")
})


app.post('/save', async(req, res) => {
    const value = req.body.value
    try {
        const document = await Document.create({ value })
        res.redirect(`/${document.id}`)
    } catch (error) {
        res.render('new', { value })
    }
})

app.get('/:id/duplicate', async(req, res) => {
    const id = req.params.id;
    try {
        const document = await Document.findById(id)
        res.render('new', { value: document.value })
    } catch (error) {
        res.redirect(`/${id}`)
    }
})


app.get('/:id', async(req, res) => {
    const id = req.params.id;
    try {
        const document = await Document.findById(id)
        res.render('code-display', { code: document.value, id })
    } catch (error) {
        res.redirect('/')
    }
})

app.listen(3000) //Port 3000