const fs = require('fs');

module.exports = {
    addguruPage: (req, res) => {
        res.render('input-guru.ejs', {
            title: "Database Guru"
            ,message: ''
        });
    },
    addguru: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let guruID = req.body.guruID;
        let nama = req.body.nama;
        let jabatan = req.body.jabatan;
        let tahunMasuk = req.body.tahunMasuk;
        let username = req.body.username;
        let password = req.body.password;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `guru` WHERE username = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-guru.ejs', {
                    message,
                    title: "Database Guru"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the guru's details to the database
                        let query = "INSERT INTO `guru` (guruID, nama, jabatan, tahunMasuk, username, password, image) VALUES ( '" +
                         guruID + "','" + nama + "', '" + jabatan + "', '" + tahunMasuk + "', '" + username + "', '" + username + "', '" + password + "', '" + image_name + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-guru.ejs', {
                        message,
                        title: "Database Guru"
                    });
                }
            }
        });
    },
    editguruPage: (req, res) => {
        let guruID = req.params.guruID;
        let query = "SELECT * FROM `guru` WHERE guruID = '" + guruID + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-guru.ejs', {
                title: "Edit Database Guru"
                ,guru: result[0]
                ,message: ''
            });
        });
    },
    editguru: (req, res) => {
        let guruID = req.body.guruID;
        let nama = req.body.nama;
        let jabatan = req.body.jabatan;
        let tahunMasuk = req.body.tahunMasuk;
       

        let query = "UPDATE `guru` SET `guruID` = '" + guruID + "',`nama` = '" + nama + "', `jabatan` = '" + jabatan + "', `tahunMasuk` = '" + tahunMasuk + "' WHERE `guru`.`ID` = '" + guruID + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteguru: (req, res) => {
        let guruID = req.params.id;
        let getImageQuery = 'SELECT image from `guru` WHERE guruID = "' + guruID + '"';
        let deleteUserQuery = 'DELETE FROM guru WHERE guruID = "' + guruID + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};
