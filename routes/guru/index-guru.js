module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `guru` ORDER BY guruID ASC"; // query database to get all the guru

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/guru');
            }
            res.render('indexg.ejs', {
                title: "Welcome to School"
                ,guru: result
            });
        });
    },
};
