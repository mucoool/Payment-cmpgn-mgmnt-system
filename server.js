const express = require('express');
const mongoose = require('mongoose');
const campaignRoutes = require('./routes/campaignRoutes');


const app = express();

const port = 3000; 
//connection to mongodb through mongoose we can change URI according local mongo configuration
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  // Home route
  app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(express.json());
app.use('/api', campaignRoutes); //route for accessing different endpoints




// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  

