const posts = require('../data/posts');
const connection = require("../data/posts-db");

function index(req, res) {
    // res.json(posts);

    // sql query
    const sql = "SELECT * FROM posts";

    // esecuzione query
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({
            error: `Database query failed`
        });

        res.json(results);
    });
};

function show(req, res) {
    // res.json(posts[req.params.id]);

    const id = req.params.id;

    const postSql = 'SELECT * FROM posts WHERE id = ?';

    const tagSql = `
    SELECT tags.label
    FROM tags
    JOIN post_tag ON tags.id = post_tag.tag_id
    WHERE post_tag.post_id = ?;
    `;

    // query per post
    connection.query(postSql, [id], (err, postResults) => {
        if (err) return res.status(500).json({
            error: 'Database query failed'
        });

        if (postResults.length === 0) return res.status(404).json({
            error: 'Post not found'
        });

        const post = postResults[0];

        // query per tag
        connection.query(tagSql, [id], (err, tagResults) => {
            if (err) return res.status(500).json({
                error: 'Database query failed'
            });

            post.tags = tagResults;
            res.json(post);
        });

    });
};

function store(req, res) {
    // Creiamo un nuovo id incrementando l'ultimo id presente
    const newId = posts[posts.length - 1].id + 1;

    // Creiamo un nuovo oggetto post
    const newPost = {
        id: newId,
        title: req.body.title,
        image: req.body.image,
        tags: req.body.tags
    };

    // Aggiungiamo il nuovo post all'array
    posts.push(newPost);

    // controlliamo
    console.log(posts);

    // Restituiamo lo status corretto e la pizza appena creata
    res.status(201);
    res.json(newPost);
};

function update(req, res) {
    // recuperiamo l'id dall' URL e trasformiamolo in numero
    const id = parseInt(req.params.id)

    // cerchiamo il post tramite id
    const post = posts.find(post => post.id === id);

    // Piccolo controllo
    if (!post) {
        res.status(404);

        return res.json({
            status: 404,
            error: "Not Found",
            message: "Post non trovato"
        })
    };

    // Aggiorniamo il post
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;

    // Controlliamo l'array
    console.log(posts);

    // Restituiamo il post appena aggiornato
    res.json(post);
};

function modify(req, res) {
    // copiamo la logica del modify
    res.send('Modifica parziale del post ' + req.params.id);
}

function destroy(req, res) {
    // // recuperiamo l'id dall' URL e trasformiamolo in numero
    // const id = parseInt(req.params.id)

    // // cerchiamo il pizza tramite id
    // const postDaEliminare = posts.find(post => post.id === id);

    // // Piccolo controllo
    // if (!postDaEliminare) {
    //     res.status(404);
    //     return res.json({
    //         status: 404,
    //         error: "Not Found",
    //         message: "Post non trovato"
    //     })
    // };

    // // Rimuoviamo la pizza dal menu
    // posts.splice(posts.indexOf(postDaEliminare), 1);

    // console.log(posts);

    // // Restituiamo lo status corretto
    // res.sendStatus(204);

    const { id } = req.params;

    connection.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({
            error: 'Failed to delete post'
        });

        res.sendStatus(204)
    });
};

// esportiamo tutto
module.exports = { index, show, store, update, modify, destroy };