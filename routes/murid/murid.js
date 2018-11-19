const fs = require('fs');

module.exports = {
    addmuridPage: (req, res) => {
        res.render('input-murid.ejs', {
            title: "Database murid"
            ,message: ''
        });
    },
    addmurid: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let muridID = req.body.muridID;
        let nama = req.body.nama;
        let kelas = req.body.kelas;
        let jurusan = req.body.jurusan;
        let alamat = req.body.alamat;
        let username = req.body.username;
        let password = req.body.password;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `murid` WHERE username = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-murid.ejs', {
                    message,
                    title: "Database murid"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the murid's details to the database
                        let query = "INSERT INTO `murid` (muridID, nama, kelas, jurusan, alamat, username, password, image) VALUES ( '" + parseInt(muridID) + "','" + nama + "', '" + kelas + "', '" + jurusan + "', '" + alamat + "', '"+ username + "', '" + password + "', '" + image_name + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-murid.ejs', {
                        message,
                        title: "Database murid"
                    });
                }
            }
        });
    },
    editmuridPage: (req, res) => {
        let muridID = req.params.id;
        let query = "SELECT * FROM `murid` WHERE muridID = '" + muridID + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-murid.ejs', {
                title: "Edit Database murid"
                ,murid: result[0]
                ,message: ''
            });
        });
    },
    editmurid: (req, res) => {
        let muridID = req.body.muridID;
        let nama = req.body.nama;
        let kelas = req.body.kelas;
        let jurusan = req.body.jurusan;
       

        let query = "UPDATE `murid` SET `muridID` = '" + muridID + "',`nama` = '" + nama + "', `kelas` = '" + kelas + "', `jurusan` = '" + jurusan + "', `alamat` = '" + alamat + "' WHERE `murid`.`ID` = '" + muridID + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletemurid: (req, res) => {
        let muridID = req.params.muridID;
        let getImageQuery = 'SELECT image from `murid` WHERE muridID = "' + muridID + '"';
        let deleteUserQuery = 'DELETE FROM murid WHERE muridID = "' + muridID + '"';

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
