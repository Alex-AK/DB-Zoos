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
  const newAnimal = req.body;
  const { name } = req.body;

  if (!name) {
    res.status(500).json({ Error: 'Name is required' });
  } else {
    db('zoos')
      .insert(newAnimal)
      .then(animal =>
        res.status(201).json({ Message: 'Successfully added', newAnimal })
      )
      .catch(err =>
        res.status(500).json({
          Message:
            'Unexpected error, unique name is required, please try again.'
        })
      );
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
server.get('/api/zoos/:id', (req, res) => {
  const id = req.params.id;
  db('zoos')
    .where({ id })
    .then(animal => {
      if (!animal) {
        res.status(404).json({ Message: 'No animal with id found.' });
      } else {
        res.status(200).json(animal);
      }
    })
    .catch(err =>
      res.status(500).json({ Message: 'Unexpected error, please try again.' })
    );
});

// update by id, name and id required - return updated object from db

server.put('/api/zoos/:id', (req, res) => {
  const id = req.params.id;
  const updatedAnimal = req.body;
  const updatedAnimalWithId = { ...updatedAnimal, id };
  const { name } = req.body;

  if (!name) {
    res.status(500).json({ Error: 'Name is required' });
  } else {
    db('zoos')
      .where({ id })
      .update(updatedAnimal)
      .then(count => {
        if (count === 0) {
          return res.status(404).json({ Error: 'Id not found' });
        } else {
          res
            .status(200)
            .json({ Message: 'Updated successfully', updatedAnimalWithId });
        }
      })
      .catch(err =>
        res.status(500).json({ message: 'Unexpected error, please try again.' })
      );
  }
});

// delete by id, id required - return ?
server.delete('/api/zoos/:id', (req, res) => {
  const id = req.params.id;
  db('zoos')
    .where({ id: id })
    .delete()
    .then(() =>
      res
        .status(200)
        .json({ Message: `Item with id of ${id} was successfully deleted` })
    )
    .catch(err => console.log(err));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
