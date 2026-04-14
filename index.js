const express = require('express');
const connection = require('./connection');
const validateGame = require('./validateGame');
const teste = require('./teste');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options ={
    swaggerDefinition: {
        info: {
            title: 'Games API',
            version: '1.0.0',
            description: 'API para gerenciamento de jogos'
        }
    },
        apis:['./index.js']
}

const openapiSpecification = swaggerJsDoc(options);

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

/** 
 * @swagger
 * /games:
 *  get:
 *      description: Retorna todos os jogos
 *      responses:
 *          200:
 *              description: ok

 */
app.get("/games", async(req, res) => {
  const [results] = await connection.execute('SELECT * FROM games');
  console.log(results);
  res.status(200).json(results);
});


/** 
 * @swagger
 * /games:
 *  post:
 *      produces:
 *        - application/json
 *      parameters:
 *       - name: game
 *         in: body
 *         required: true
 *         schema:
 *          type: object
 *          properties:
 *              name:
 *                type: string
 *              release_year:
 *                type: number
 *              sinopse:
 *                type: string
 * 
 *      responses:
 *          201:
 *              description: Jogo criado com sucesso
 */
app.post("/games",validateGame, async(req, res) => {
  const { name, release_year, sinopse} = req.body;
  const [result] = await connection.execute('INSERT INTO games (name, release_year, sinopse) VALUES (?, ?, ?)', [name, release_year, sinopse]);

  const newGame = {
    id: result.insertId,
    name,
    release_year,
    sinopse
  };
  res.status(201).json(newGame);
});

app.get("/games/:id", async(req, res) => {
  const { id } = req.params;
  const [results] = await connection.execute('SELECT * FROM games WHERE id = ?', [id]); 
    if (results.length === 0) {
        return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json(results[0]);
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});