module.exports = {
    getHomePage2: (req, res) => {
        let query = "SELECT * FROM `murid` ORDER BY muridID ASC"; // query database to get all the guru

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/murid');
            }
            res.render('indexm.ejs', {
                title: "Welcome to School"
                ,murid: result
            });
        });
    },
};
