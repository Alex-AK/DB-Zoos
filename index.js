const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);
const server = express();

server.use(helmet());
server.use(express.json());
// endpoints here

// post, name required - return id of new animal with 201
server.post('/api/zoos', (req, res) => {
  const animal = req.body;
  const { name } = req.body;

  if (!name) {
    res.status(500).json({ message: 'Name is required' });
  } else {
    db.insert(animal)
      .then()
      .catch(err =>
        res.status(500).json({ message: 'Unexpected error, please try again.' })
      );
    // use SQL to post to table
  }
});

// get - return all animals
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(animals => res.status(200).json(animals))
    .catch(err =>
      res
        .status(500)
        .json({ message: 'Unexpected error, please try again.', err })
    );
});

// get by id - return single animal with matching id

// update by id, name and id required - return updated object from db

// delete by id, id required - return ?

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
