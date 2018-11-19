module.exports = {
    getAdminPage: (req, res) => {
        let query = "SELECT * FROM `admin` ORDER BY adminID ASC"; // query database to get all the admin

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/admin');
            }
            res.render('index.ejs', {
                title: "Welcome to School"
                ,guru: result
            });
        });
    },
};
