const express = require('express')
const dotenv = require('dotenv')
const connectDB = require("./config/mongoConfig");
const cors = require('cors');
const rateLimit = require("express-rate-limiter");


const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


dotenv.config();
connectDB();
corsOptions = {
    origin: '*',
    credentials: true,
}
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth', require('./routes/authRoutes') )
app.use('/api/document', require('./routes/documentRoutes') )
app.use('/api/chat', require('./routes/chatRoutes') )

app.listen(5000, () => {
  console.log('Example app listening on port 3000!')
})