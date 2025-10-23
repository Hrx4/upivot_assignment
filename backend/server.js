const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./config/mongoConfig");
const cors = require('cors');
const {rateLimit} = require("express-rate-limit")


const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const limiter = rateLimit({
  WindowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
})

dotenv.config();
connectDB();
corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://upivot-assignment-emdg.vercel.app/login",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', limiter, (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth',limiter, require('./routes/authRoutes') )
app.use('/api/document',limiter, require('./routes/documentRoutes') )
app.use('/api/chat',limiter, require('./routes/chatRoutes') )

app.listen(5000, () => {
  console.log('Example app listening on port 3000!')
})