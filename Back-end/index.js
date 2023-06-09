const bodyParser = require("body-parser");
const express = require("express");

require("dotenv").config();
const mysql = require("mysql2");

const DB = process.env.DATABASE_URL;
const connection = mysql.createConnection(DB);

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to database");
});

const PORT = 3030;
const app = express();
const path = require("path");

app.use(bodyParser.json());

// GET
app.get('/datos', (req, res) => {
  connection.query('SELECT * FROM sounds', (error, results, fields) => {
    if (error) throw error;
    res.send(results);
    // console.log("Datos: \t" + results);
  });
});


app.get('/playlist', (req, res) => {
  connection.query('SELECT * FROM playlist_configuration', (error, results, fields) => {
    if (error) throw error;
    res.send(results);
    // console.log("Playlists: \t" + results);
  });
});

app.get('/theme', (req,res) => {
  connection.query("SELECT playlist.playlist_id, playlist_name, sounds.sound_id, sound_name, sound_source FROM playlist JOIN playlist_sounds ON playlist.playlist_id = playlist_sounds.playlist_id  JOIN sounds ON sounds.sound_id = playlist_sounds.sound_id"  , (error, results, fields) => {
    if (error) throw error;
    res.send(results);
    // console.log("Playlists: \t" + results);
  });
})

app.get('/theme/:id', (req,res) => {
  connection.query("SELECT playlist.playlist_id, playlist_name, sounds.sound_id, sound_name, sound_source FROM playlist JOIN playlist_sounds ON playlist.playlist_id = playlist_sounds.playlist_id  JOIN sounds ON sounds.sound_id = playlist_sounds.sound_id WHERE playlist.playlist_id="+ req.params.id , (error, results, fields) => {
    if (error) throw error;
    res.send(results);
    // console.log("Playlists: \t" + results);
  });
})

app.get('/playlist/:id', (req, res) => {
  connection.query('SELECT * FROM playlist_configuration WHERE id_configuration  = ' + req.params.id, (error, results, fields) => {
    if (error) throw error;
    res.send(results);
    // console.log("Playlist: \t" + results + "Id: \t" + req.params.id);
  });
});

// POST
app.post('/playlist', (req, res) => {
  const { 
    name, 
    theme, 
    first_sound,
    first_sound_volume,
    second_sound,
    second_sound_volume,
    third_sound,
    third_sound_volume,
    fourth_sound,
    fourth_sound_volume,
    fifth_sound,
    fifth_sound_volume,
    sixth_sound,
    sixth_sound_volume
  } = req.body;

  var query = "INSERT INTO playlist_configuration (name, theme, first_sound, first_sound_v, second_sound, second_sound_v, third_sound, third_sound_v, fourth_sound, fourth_sound_v, fifth_sound, fifth_sound_v, sixth_sound, sixth_sound_v) VALUES ('" + name + "', '" + theme + "', '" + first_sound + "', '" + first_sound_volume + "', '" + second_sound + "', '" + second_sound_volume + "', '" + third_sound + "', '" + third_sound_volume + "', '" + fourth_sound + "', '" + fourth_sound_volume + "', '" + fifth_sound + "', '" + fifth_sound_volume + "', '" + sixth_sound + "', '" + sixth_sound_volume + "')";
  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

// PUT
app.put('/playlist/:id', async (req, res) => {
  const id = req.params.id;
  const {
    name,
    theme,
    first_sound,
    first_sound_volume,
    second_sound,
    second_sound_volume,
    third_sound,
    third_sound_volume,
    fourth_sound,
    fourth_sound_volume,
    fifth_sound,
    fifth_sound_volume,
    sixth_sound,
  } = req.body;

  const query = "UPDATE playlist_configuration SET name = '" + name + "', theme = '" + theme + "', first_sound = '" + first_sound + "', first_sound_volume = '" + first_sound_volume + "', second_sound = '" + second_sound + "', second_sound_volume = '" + second_sound_volume + "', third_sound = '" + third_sound + "', third_sound_volume = '" + third_sound_volume + "', fourth_sound = '" + fourth_sound + "', fourth_sound_volume = '" + fourth_sound_volume + "', fifth_sound = '" + fifth_sound + "', fifth_sound_volume = '" + fifth_sound_volume + "', sixth_sound = '" + sixth_sound + "' WHERE id_configuration = " + id;

  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

// DELETE
app.delete('/playlist/:id', (req, res) => {
  connection.query('DELETE FROM playlist_configuration WHERE id_configuration = ' + req.params.id, (error, results, fields) => {
    if (error) throw error;
    res.send(results);
    // console.log("Datos: \t" + results);
  });
});

app.use(express.static(path.resolve("client/build")));
// Todas las peticiones GET que no manejamos ahora regresarán nuestra React App
// Agrega esto antes del “app.listen”
app.get("*", (req, res) => {
  res.sendFile(path.resolve("client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});