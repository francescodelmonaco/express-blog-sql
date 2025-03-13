function notFound(req, res, next) { // non usiamo err perchè per Express non è un errore chiamare una rotta inesistente
    res.status(404);

    res.json({
        error: "Not Found",
        message: "Pagina non trovata"
    });
};

module.exports = notFound;