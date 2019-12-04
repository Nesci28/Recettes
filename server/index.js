const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const monk = require('monk');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');

require('dotenv').config();

// Connect to MongoDB
const db = monk(
  `${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`,
);
const recettesDB = db.get(`recettes`);

const app = express();

// Logger
app.use(morgan('tiny'));

// Cors
app.use(cors());

// Express body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/api/v1/findAll', async (_, res, __) => {
  const recettes = await recettesDB.find({});
  res.json(recettes);
});

app.get('/api/v1/find/id/:id', async (req, res, _) => {
  const id = req.params.id;
  const recette = await recettesDB.find({ id: id });
  res.json(recette);
});

app.get('/api/v1/find/type/:type', async (req, res, _) => {
  const type = req.params.type;
  const recettes = await recettesDB.find({ type });
  res.json(recettes);
});

app.get('/api/v1/filter/:query', async (req, res, _) => {
  const query = req.params.query.toLowerCase();
  let recettes = await recettesDB.find({});
  recettes = recettes.filter(
    recette =>
      recette.name.toLowerCase().includes(query) ||
      recette.keywords
        .join('')
        .toLowerCase()
        .includes(query),
  );
  res.json(recettes);
});

app.post('/api/v1/add', async (req, res, _) => {
  const recette = req.body;
  recette.id = uuidv4();
  recette.filtered = false;
  recette.ingredients.forEach(ing => {
    ing.quantity = `${ing.quantity} ${ing.unit}`;
    ing.disabled = false;
  });
  let feedback;
  try {
    feedback = await recettesDB.insert(recette);
  } catch (err) {
    feedback = { message: 'An error has occured' };
  }
  res.json(feedback);
});

app.post('/api/v1/update', async (req, res, _) => {
  const id = req.body.id;
  const recette = req.body;
  recette.id = id;
  recette.filtered = false;
  recette.ingredients.forEach(ing => {
    ing.quantity = `${ing.quantity} ${ing.unit}`;
    ing.disabled = false;
  });
  try {
    await recettesDB.findOneAndDelete({ id });
  } catch (err) {
    feedback = { message: 'An error has occured' };
    res.json(feedback);
  }
  try {
    feedback = await recettesDB.insert(recette);
  } catch (err) {
    feedback = { message: 'An error has occured' };
  }
  res.json(feedback);
});

app.delete('/api/v1/delete/:type/:id', async (req, res, _) => {
  const type = req.params.type;
  const id = req.params.id;
  console.log('type, id :', type, id);
  let feedback;
  try {
    feedback = await recettesDB.findOneAndDelete({ type, id });
  } catch (err) {
    feedback = { message: 'An error has occured' };
  }
  res.json(feedback);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
