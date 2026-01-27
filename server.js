import express from "express"
import fs from "fs"
import path from "path"
import bodyParser from "body-parser"

const app = express()
const __dirname = path.resolve()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Lista di colori casuali disponibili
const colors = ["#fff475", "#ff8a80", "#b9f6ca", "#80d8ff", "#ffd180", "#ff80ab", "#a0c4ff"]

function loadPosts() {
  try {
    return JSON.parse(fs.readFileSync("postits.json", "utf8"))
  } catch {
    return []
  }
}

function savePosts(posts) {
  fs.writeFileSync("postits.json", JSON.stringify(posts, null, 2))
}

app.get("/", (req, res) => {
  res.render("home")
})

app.post("/add", (req, res) => {
  const posts = loadPosts()
  
  // Scegli un colore casuale al momento della creazione
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  
  posts.push({
    name: req.body.name,
    email: req.body.email,
    title: req.body.title,
    desc: req.body.desc,
    color: randomColor,
    created: new Date()
  })
  savePosts(posts)
  res.redirect("/postit")
})

app.get("/postit", (req, res) => {
  res.render("postit", { postits: loadPosts() })
})

app.listen(3000, () => console.log("Server running on http://localhost:3000"))
