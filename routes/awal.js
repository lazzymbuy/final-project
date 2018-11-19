module.exports = {
    getHomePage3: (req, res) => {
       
       
            res.render('halamanutama.ejs', {
                title: "Welcome to School"
            });
    },
};
