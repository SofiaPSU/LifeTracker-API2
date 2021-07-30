const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { PORT } = require("./config")
const {NotFoundError} = require("./utils/errors")
const authRoutes = require("./routes/auth")
const security = require("./middleware/security")
const Nutrition = require("./routes/nutrition")
const activity = require("./routes/activity")

const app = express()


app.use(cors())
app.use(express.json())
app.use(morgan("tiny"))

//attach credentials to res.locals.user
app.use(security.extractUserFromJwt)
app.use("/auth", authRoutes)
app.use("/nutrition", Nutrition)
app.use("/activity", activity )

app.get("/", async (req, res, next) => {
  res.status(200).json({ ping: "pong" })
})

//Sofia - added in error handling
app.use((req, res, next)=>{
  return next(new NotFoundError)
})

//Obehi:  Generic error handler; anything unhandled goes here. 
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message

  return res.status(status).json({
    error: { message, status },
  })
})


//Obehi: Backend Port 3001
app.listen(PORT, ()=> {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})


