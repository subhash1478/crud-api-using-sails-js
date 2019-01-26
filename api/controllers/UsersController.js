module.exports = {
    async uploadProfileImage(req, res) {
        var requestData = req.body;
        var loggedUserId = requestData.id;
        var setfilename = `${loggedUserId}${Date.now()}.jpg`
        req.file('profile_image').upload({
            saveAs: setfilename,
            dirname: require('path').resolve(sails.config.appPath, 'public/'),
            maxBytes: 10000000
        }, async function whenDone(err, uploadedFiles) {
            if (err) {
                return res.serverError(err);
            }
            if (uploadedFiles.length === 0) {
                return res.badRequest('No file was uploaded');
            } else {
                var obj = {
                    profile_image: setfilename,
                }
                await Users.update({ id: loggedUserId })
                    .set(obj).fetch()
                    .then(function (result) {
                        var image = `${sails.config.custom.imageUrl}/${setfilename}`
                        return ResponseService.json(200, res, "Your profile updated successfully", image)
                    })
                    .catch(function (err) {
                        sails.log.debug(`Some error occured requestData.${err}`);
                        return ResponseService.json(500, res, err)
                    })
            }
        });
    },
    //
    // ──────────────────────────────────────────────────────────────────── I ──────────
    //   :::::: E M P L O Y E E   L O G I N : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────────────
    //
    async login(req, res) {
        var requestData = req.body;
        if (!requestData.email || !requestData.password) {
            return ResponseService.json(400, res, "please enter email and password")
        }
        await Users.findOne({ email: requestData.email, password: requestData.password })
            .then(function (user) {
                console.log(user);
                if (!user) {
                    return ResponseService.json(400, res, "Invalid email or password")
                }
                var responseData = {
                    user: user,
                    token: JwtService.issue({ email: user.email, id: user.id })
                }
                return ResponseService.json(200, res, "Login Successful", responseData)
            })
            .catch(function (err) {
                return ResponseService.json(500, res, err)
            });
    },
    //
    // ──────────────────────────────────────────────────────────────────── I ──────────
    //   :::::: R E S E T   P A S S W O R D : :  :   :    :     :        :          :
    // ──────────────────────────────────────────────────────────────────────────────
    //

    async resetpassword(req, res) {
        var requestData = req.body;
        //return ResponseService.json(200, res, "Login Successful", requestData)
        if (!requestData.email || !requestData.password) {
            return ResponseService.json(403, res, requestData + "please enter your password and confirm password")
        }
        //console.log(requestData.password);
        if (requestData.password != requestData.confirm_password) {
            return ResponseService.json(403, res, "Your password and Confirm password not matched")
        }
        await Users.update({ email: requestData.email })
            .set({ password: requestData.password }).fetch()
            .then(function (result) {
                return ResponseService.json(200, res, "Your password updated successfully", result)
            })
            .catch(function (err) {
                return ResponseService.json(500, res, err)
            });
    },
    //
    // ────────────────────────────────────────────────────────────────────────────────────── I ──────────
    //   :::::: E M P L O Y E E   P R O F I L E   U P D A T E : :  :   :    :     :        :          :
    // ────────────────────────────────────────────────────────────────────────────────────────────────
    //
    async profileUpdate(req, res) {
        var requestData = req.body;
        var loggedUserId = req.query.id
        var data = {
            location: requestData.location,
            address: requestData.address,
            password: requestData.password,
            state: requestData.state,
            city: requestData.city,
            zip: requestData.zip,
            country: requestData.country,
            online: requestData.online,
            profileImage: requestData.profileImage,
            about: requestData.about,
            birthday: requestData.birthday,
            firstName: requestData.firstName,
            lastName: requestData.lastName,
            email: requestData.email,
        }
        await Users.update({ id: loggedUserId })
            .set(data).fetch()
            .then(function (result) {
                return ResponseService.json(200, res, "Your profile updated successfully", result)
            })
            .catch(function (err) {
                return ResponseService.json(500, res, err)
            });

    },
    async register(req, res) {
        var requestData = req.body;
        var data = {
            location: requestData.location,
            address: requestData.address,
            password: requestData.password,
            state: requestData.state,
            city: requestData.city,
            zip: requestData.zip,
            country: requestData.country,
            online: requestData.online,
            profileImage: requestData.profileImage,
            about: requestData.about,
            birthday: requestData.birthday,
            firstName: requestData.firstName,
            lastName: requestData.lastName,
            email: requestData.email,
        }
        await Users.create(data)
            .fetch()
            .then(function (result) {
                return ResponseService.json(200, res, "Your profile create successfully", result)
            })
            .catch(function (err) {
                return ResponseService.json(500, res, err)
            });

    },
    async getUsers(req, res) {

        await Users.find({})
            .then(function (result) {
                return ResponseService.json(200, res, "Record fetch successfully", result)
            })
            .catch(function (err) {
                return ResponseService.json(500, res, err)
            });

    },
    async deleteUsers(req, res) {

        var request_data = req.query;
        await Users.destroy({ id: request_data.id })
            .then(function (result) {
                return ResponseService.json(200, res, "removed Users", result)
            })
            .catch(function (err) {
                return ResponseService.json(500, res, err)
            });

    },
};
