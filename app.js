const express = require('express');
const { Pool } = require('pg');

// Configura tu conexión a ElephantSQL
const pool = new Pool({
    connectionString: 'postgres://pbcoytjk:xMqkhzeCGe7NQhLIEICRk_r9pIAhvwik@flora.db.elephantsql.com/pbcoytjk',
    ssl: {
        rejectUnauthorized: false,
    },
});

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar la solicitud del formulario
app.post('/enviarDatos', async (req, res) => {
    const { nombre, dni, ciudad_origen, ciudad_destino, peso } = req.body;
    let client;

    try {
        client = await pool.connect();
        const result = await client.query(
            'INSERT INTO datos_envio (nombre, dni, ciudad_origen, ciudad_destino, peso) VALUES ($1, $2, $3, $4, $5)',
            [nombre, dni, ciudad_origen, ciudad_destino, peso]
        );
        const insertedRow = result.rows[0];

        res.status(200).json({ success: true, data: insertedRow });
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    } finally {
        if (client) {
            client.release();
        }
    }
});


// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});

