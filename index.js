const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./Database/db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectToDatabase().then((collections) => {
  // Register routes
  app.use('/', require('./Routes/signup')(collections));
  app.use('/', require('./Routes/login')(collections));
  app.use('/', require('./Routes/client')(collections));
  app.use('/', require('./Routes/investor')(collections));
  app.use('/', require('./Routes/dashboard')(collections));
  app.use('/', require('./Routes/userType')(collections));

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server due to DB connection error:", error);
});
