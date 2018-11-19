const fs = require('fs');

module.exports = {
    addadminPage: (req, res) => {
        res.render('input-admin.ejs', {
            title: "Database admin"
            ,message: ''
        });
    },
    addadmin: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let adminID = req.body.adminID;
        let nama = req.body.nama;
        let jabatan = req.body.jabatan;
        let asal = req.body.asal;
        let username = req.body.username;
        let password = req.body.password;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `admin` WHERE username = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-admin.ejs', {
                    message,
                    title: "Database admin"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the admin's details to the database
                        let query = "INSERT INTO `admin` (adminID, nama, jabatan, asal, username, password, image) VALUES ( '" +
                         adminID + "','" + nama + "', '" + jabatan + "', '" + asal + "', '" + username + "', '" + password + "', '" + image_name + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/admin');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-admin.ejs', {
                        message,
                        title: "Database admin"
                    });
                }
            }
        });
    },
    editadminPage: (req, res) => {
        let adminID = req.params.adminID;
        let query = "SELECT * FROM `admin` WHERE adminID = '" + adminID + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-admin.ejs', {
                title: "Edit Database admin"
                ,admin: result[0]
                ,message: ''
            });
        });
    },
    editadmin: (req, res) => {
        let adminID = req.body.adminID;
        let nama = req.body.nama;
        let jabatan = req.body.jabatan;
        let asal = req.body.asal;
       

        let query = "UPDATE `admin` SET `adminID` = '" + adminID + "',`nama` = '" + nama + "', `jabatan` = '" + jabatan + "', `asal` = '" + asal + "' WHERE `admin`.`ID` = '" + adminID + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/admin');
        });
    },
    deleteadmin: (req, res) => {
        let adminID = req.params.adminID;
        let getImageQuery = 'SELECT image from `admin` WHERE adminID = "' + adminID + '"';
        let deleteUserQuery = 'DELETE FROM admin WHERE adminID = "' + adminID + '"';

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
                    res.redirect('/admin');
                });
            });
        });
    }
};
