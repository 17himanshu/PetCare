var express = require("express");
var mysql = require("mysql");
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 3030;
const app = express();

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

var dbConfigurationObj = {
    host: "sql12.freemysqlhosting.net",
    user: "sql12676400",
    password: "lK2V8HLcs5",
    database: "sql12676400"
}

var dbRef = mysql.createConnection(dbConfigurationObj);

dbRef.connect(function (err) {
    if (err == null)
        console.log("Connected Succesfuly.......");
    else
        console.log(err.toString());
})

app.use(express.static("public"));

app.get("/", function (req, resp) {
    var absPath = __dirname;
    var path = absPath + "/public/index.html";
    resp.sendFile(path);
});

app.get("/signup-process-get", function (req, resp) {
    var dataAry = [req.query.emailForServer, req.query.pwdForServer, req.query.typeForServer];

    dbRef.query("insert into users values(?,?,?,1)", dataAry, function (err, table) {
        if (err == null)
            if (table.length == 1)
                resp.send("Signed Up Successfully");
            else
                resp.send(err);
    });
});

app.get("/login-process-get", function (req, resp) {
    var dataAry = [req.query.emailForServer, req.query.pwdForServer];
    dbRef.query("select * from users where emailid=? and pwd=?", dataAry, function (err, table) {

        if (err == null) {
            resp.send(table);
        }
        else {
            resp.send(err.toString());
        }
    });

});

app.get("/checkEmailInTable", function (req, resp) {

    dbRef.query("select * from users where emailid=?", [req.query.emailForServer], function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            if (table.length == 1) {
                resp.send("Already Occupied");
            }
            else
                resp.send("Available");
    });
});

app.get("/dclient", function (req, resp) {
    var absPath = __dirname;
    var path = absPath + "/public/dash-client.html";
    resp.sendFile(path);
});
app.get("/dcaretaker", function (req, resp) {
    var absPath = __dirname;
    var path = absPath + "/public/dash-caretaker.html";
    resp.sendFile(path);
});

app.get("/dcaretkr-profile", function (req, resp) {
    var absPath = __dirname;
    var path = absPath + "/public/profile-caretaker.html";
    resp.sendFile(path);
});


app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

app.post("/client-profile-form-post", function (req, resp) {

    var fullPath_pic1, pic1;
    var fullPath_pic2, pic2;


    if (req.files != null && req.files.ppic != null) {
        pic1 = req.files.ppic.name;

        fullPath_pic1 = process.cwd() + "/public/uploads/" + req.files.ppic.name;
        req.files.ppic.mv(fullPath_pic1, function (err) {
            if (err)
                console.log(err.toString());
            else
                console.log("File Uploaded succesfuly with data= " + JSON.stringify(req.body));
        });
    }
    else
        pic1 = "nopic.png";

    // for pic-2 -------------------------------------------------

    if (req.files != null && req.files.idpic != null) {
        pic2 = req.files.idpic.name;

        fullPath_pic2 = process.cwd() + "/public/uploads/" + req.files.idpic.name;
        req.files.idpic.mv(fullPath_pic2, function (err) {
            if (err)
                console.log(err.toString());
            else
                console.log("File Uploaded succesfuly with data= " + JSON.stringify(req.body));
        });
    }
    else
        pic2 = "nopic.png";

    resp.contentType("text/html");

    var dataAry = [req.body.clientEmail, req.body.clientName, req.body.clientContact, req.body.clientAddress, req.body.clientCity, req.body.clientState, req.body.clientPin, pic1, pic2, req.body.clientPets];

    dbRef.query("insert into clients values(?,?,?,?,?,?,?,?,?,?)", dataAry, function (err) {
        if (err == null) {
            var absPath = __dirname;
            var path = absPath + "/public/dash-client.html";
            resp.sendFile(path);
        }
        else
            resp.send(err.toString());
    });
});

app.post("/client-update-form-post", function (req, resp) {

    var ppic = "", idpic = "";

    if (req.files == null) {
        ppic = req.body.hdn1;
        idpic = req.body.hdn2;
    }
    else {
        if (req.files.ppic == null) {
            ppic = req.body.hdn1;
        }
        else {
            var fullPath = process.cwd() + "/public/uploads/" + req.files.ppic.name;
            ppic = req.files.ppic.name;

            req.files.ppic.mv(fullPath, function (err) {
                if (err) {
                    console.log(err.toString());
                }
                else {
                    console.log("File uploaded Successfully=" + JSON.stringify(req.body));
                }
            })
        }


        if (req.files.idpic == null) {
            console.log("hlo");
            idpic = req.body.hdn2;
        }
        else {
            var fullPath1 = process.cwd() + "/public/uploads/" + req.files.idpic.name;
            idpic = req.files.idpic.name;

            req.files.idpic.mv(fullPath1, function (err) {
                if (err) {
                    console.log(err.toString());
                }
                else {
                    console.log("File uploaded Successfully=" + JSON.stringify(req.body));
                }
            })
        }
    }


    var dataAry = [req.body.clientName, req.body.clientContact, req.body.clientAddress, req.body.clientCity, req.body.clientState, req.body.clientPin, ppic, idpic, req.body.clientPets, req.body.clientEmail];

    dbRef.query("update clients set name=?,mobile=?,address=?,city=?,state=?,pin=?,profilepic=?,idproofpic=?,pets=? where email=?", dataAry, function (err) {
        if (err == null)
            resp.send("<h2><center>Record updated successfullyyyyyyy");
        else
            resp.send(err.toString());
    });
});

app.get("/fetchFromTable", function (req, resp) {
    dbRef.query("select * from clients where email=?", [req.query.emailforServer], function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);

    });
});

app.post("/caretaker-profile-form-post", function (req, resp) {

    var fullPath, pic;
    if (req.files != null && req.files.idpic != null) {
        resp.contentType("text/html");
        pic = req.files.idpic.name;

        fullPath = process.cwd() + "/public/uploads/" + req.files.idpic.name;
        req.files.idpic.mv(fullPath, function (err) {
            if (err)
                console.log(err.toString());
            else
                console.log("File Uploaded succesfuly with data= " + JSON.stringify(req.body));
        });
    }
    else
        pic = "nopic.png";


    var dataAry = [req.body.caretkrEmail, req.body.caretkrName, req.body.caretkrContact, req.body.caretkrAddress, req.body.caretkrWebsite, req.body.caretkrState, req.body.caretkrCity, req.body.caretkrPin, req.body.selPets, pic];
    // console.log(dataAry);
    dbRef.query("insert into caretakers values(?,?,?,?,?,?,?,?,?,?)", dataAry, function (err) {
        if (err == null) {
            var absPath = __dirname;
            var path = absPath + "/public/dash-caretaker.html";
            resp.sendFile(path);
        }
        else
            resp.send(err.toString());
    });


});

app.post("/caretaker-update-form-post", function (req, resp) {

    resp.contentType("text/html");
    var picName = "";

    var picName;
    if (req.files == null || req.files.idpic == null) {
        picName = req.body.hdn;
    }
    else {
        var fullPath = process.cwd() + "/public/uploads/" + req.files.idpic.name;
        picName = req.files.idpic.name;
        req.files.idpic.mv(fullPath, function (err) {
            if (err)
                console.log(err.toString());
            else
                console.log("File uploaded Successfully with data=" + JSON.stringify(req.body));
        });
    }

    var dataAry = [req.body.caretkrName, req.body.caretkrContact, req.body.caretkrAddress, req.body.caretkrWebsite, req.body.stt, req.body.city ? req.body.city.trim() : '', req.body.caretkrPin, req.body.selPets, picName, req.body.caretkrEmail];

    dbRef.query("update caretakers set name=?,mobile=?,address=?,website=?,state=?,city=?,pin=?,selpets=?,idproofpic=? where email=?", dataAry, function (err) {
        if (err == null)
            resp.send("<h2><center>Record updated successfullyyyyyyy");
        else
            resp.send(err.toString());
    });
});

app.get("/caretkr-fetchFromTable", function (req, resp) {
    dbRef.query("select * from caretakers where email=?", [req.query.emailForServer], function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);
    });
});

app.get("/dash-admin", function (req, resp) {
    var absPath = __dirname;
    var path = absPath + "/public/dash-admin.html";
    resp.sendFile(path);
});

app.get("/fetch-all-users-angular", function (req, resp) {
    dbRef.query("select * from users", function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);
    })
})
app.get("/fetch-all-clients-angular", function (req, resp) {
    dbRef.query("select * from clients", function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);
    })
})
app.get("/fetch-all-caretakers-angular", function (req, resp) {
    dbRef.query("select * from caretakers", function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);
    })
})

app.get("/block-user-angular", function (req, resp) {
    var dataAry = [req.query.xEmail];
    dbRef.query("update users set status=0 where emailid=?", dataAry, function (err, result) {
        if (err != null)
            resp.send(err.toString());
        else if (result.affectedRows == 1)
            resp.send("Blocked successfullyyyyyyy");
        else
            resp.send("<h2><center>Invalid Id");
    })
})

app.get("/resume-user-angular", function (req, resp) {
    var dataAry = [req.query.xEmail];
    dbRef.query("update users set status=1 where emailid=?", dataAry, function (err, result) {
        if (err != null)
            resp.send(err.toString());
        else if (result.affectedRows == 1)
            resp.send("Resumed successfullyyyyyyy");
        else
            resp.send("<h2><center>Invalid Id");
    })
})

app.get("/delete-client-angular", function (req, resp) {

    var dataAry = [req.query.xEmail];

    dbRef.query("delete from clients where email=?", dataAry, function (err, result) {
        if (err != null)
            resp.send(err.toString());

        else if (result.affectedRows == 1)
            resp.send("<h2><center>Deleted successfullyyyyyyy");
        else
            resp.send("<h2><center>Invalid Id");
    })
})

app.get("/delete-caretaker-angular", function (req, resp) {

    var dataAry = [req.query.xEmail];

    dbRef.query("delete from caretakers where email=?", dataAry, function (err, result) {
        if (err != null)
            resp.send(err.toString());

        else if (result.affectedRows == 1)
            resp.send("<h2><center>Deleted successfullyyyyyyy");
        else
            resp.send("<h2><center>Invalid Id");
    })
})

app.get("/fetch-all-cities-angular", function (req, resp) {
    dbRef.query("select distinct city from caretakers", function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);
    })
})

app.get("/caretkr-finder", function (req, resp) {
    var absPath = __dirname;
    var path = absPath + "/public/caretaker-finder.html";
    resp.sendFile(path);
});

app.get("/fetch-all-caretakers-angular-finder", function (req, resp) {

    var dataAry = [req.query.cityforserver.trim(), "%" + req.query.petforserver.trim() + "%"];
    // console.log(req.query.cityforserver);

    dbRef.query("select * from caretakers where city=? and selpets like ?", dataAry, function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);
    });
});

app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.post("/settings-caretaker", function (req, res) {
    var dataAry = [req.body.email, req.body.oldpwd];

    dbRef.query("select * from users where emailid=? and pwd=?", dataAry, function (err, table) {
        if (err != null) {
            res.send(err.toString());
        } else if (table.length == 1 && req.body.newpwd == req.body.confirmpwd) {
            dbRef.query("update users set pwd=? where emailid=?", [req.body.newpwd, req.body.email], function (err) {
                if (err != null) {
                    res.send(err.toString());
                } else {
                    res.send("Password changed successfully");
                }
            });
        } else {
            res.send("Invalid Old Password or New Password and Confirm Password does not match");
        }
    });
});
app.post("/settings-client", function (req, res) {
    var dataAry = [req.body.email, req.body.oldpwd];

    dbRef.query("select * from users where emailid=? and pwd=?", dataAry, function (err, table) {
        if (err != null) {
            res.send(err.toString());
        } else if (table.length == 1 && req.body.newpwd == req.body.confirmpwd) {
            dbRef.query("update users set pwd=? where emailid=?", [req.body.newpwd, req.body.email], function (err) {
                if (err != null) {
                    res.send(err.toString());
                } else {
                    res.send("Password changed successfully");
                }
            });
        } else {
            res.send("Invalid Old Password or New Password and Confirm Password does not match");
        }
    });
});