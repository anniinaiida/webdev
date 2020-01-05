'use strict'

// npm install mysql --save
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Note! Do not use root credentials in production!
  password: '',
  database: 'products'
});

module.exports =
  {
    fetchAll: function (req, res) {
      let sql = 'SELECT a.AVAIN, NIMI, OSOITE, POSTINRO, POSTITMP, at.SELITE as TYYPPI_SELITE  FROM Asiakas a INNER JOIN Asiakastyyppi at ON at.Avain = a.Asty_avain WHERE 1=1';
      if (req.query.asty_avain != undefined)
        sql += " AND asty_avain = " + req.query.asty_avain;
      if (req.query.nimi != undefined)
        sql += " AND Nimi LIKE '" + req.query.nimi + "'"; //t
      if (req.query.osoite != undefined)
        sql += " AND Osoite LIKE '" + req.query.osoite + "%'";

      connection.query(sql, function (error, results, fields) {

        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          //res.send(error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }
        else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.json(results);

        }
      });
    },
    fetchTyyppiSelite: function (req, res) {
      let sql = 'SELECT Selite FROM Asiakastyyppi WHERE 1=1';

      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          //res.send(error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }
        else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.send(results);
        }
      });
    },

    fetchTyyppi: function (req, res) {
      console.log("query (GET): ", req.query);

      let query = 'SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi ORDER BY Lyhenne';

      connection.query(query, function (error, results, fields) {

        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          //res.send(error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }
        else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.send(results);

          //res.send({code: "OK", error_msg : "", data : results});
        }
      });
    },
    fetchAlltuote: function (req, res) {
      let sql = 'SELECT t.id, t.nimi, t.selite, tyyppi_id, ostopvm, valmistaja, hinta, tt.nimi as tyyppi_nimi, tt.selite as tyyppi_selite FROM tuote t INNER JOIN tuotetyyppi tt ON tt.id = t.tyyppi_id  WHERE 1=1';
      

      if (req.query.id != undefined)
        sql += " AND Id LIKE '%" + req.query.id + "%'";
      if (req.query.nimi != undefined)
        sql += " AND Nimi LIKE '%" + req.query.nimi + "%'";
      if (req.query.selite != undefined)
        sql += " AND Selite LIKE '%" + req.query.selite + "%'";
      if (req.query.tyyppi_id != undefined)
        sql += " AND Tyyppi_id =" + req.query.tyyppi_id;
      if (req.query.ostopvm != undefined)
        sql += " AND Ostopvm LIKE '%" + req.query.ostopvm + "%'";
      if (req.query.valmistaja != undefined)
        sql += " AND  LIKE '%" + req.query.selite + "%'";
      if (req.query.selite != undefined)
        sql += " AND Selite LIKE '%" + req.query.selite + "%'";

      console.log("sql :" + sql);

      connection.query(sql, function (error, results, fields) {

        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          //res.send(error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }
        else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.json(results);

        }
      });
    },
    fetchAlltuotetyyppi: function (req, res) {
      let sql = 'SELECT * FROM Tuotetyyppi WHERE 1=1';
      if (req.query.id != undefined)
        sql += " AND Id LIKE '%" + req.query.id + "%'";
      if (req.query.nimi != undefined)
        sql += " AND Nimi LIKE '%" + req.query.nimi + "%'";
      if (req.query.koodi != undefined)
        sql += " AND koodi LIKE '%" + req.query.koodi + "%'";


      connection.query(sql, function (error, results, fields) {

        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          //res.send(error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }
        else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.json(results);

        }
      });
    },
    fetchtuotetyyppi: function (req, res) {
      console.log("query (GET): ", req.query);

      let query = 'SELECT Id, Koodi, Nimi FROM Tuotetyyppi';

      connection.query(query, function (error, results, fields) {

        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          //res.send(error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }
        else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.send(results);

          //res.send({code: "OK", error_msg : "", data : results});
        }
      });
    },
    fetchOne: function (req, res) {
      // GET asiakas/:id
      console.log("params (GET one): " + JSON.stringify(req.params));

      let query = 'SELECT NIMI, OSOITE, POSTINRO, POSTITMP FROM Asiakas WHERE AVAIN='+req.params.id;

      connection.query(query, function (error, results, fields) {

        if (error) {
          console.log("Error fetching data from db, reason: " + error);
          //res.send(error);
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }
        else {
          console.log("Data = " + JSON.stringify(results[0]));
          res.statusCode = 200;
          res.send(results);

          //res.send({code: "OK", error_msg : "", data : results});
        }
      });
    },

    create: function (req, res) {
      console.log("------------------");
      console.log("CREATE");

      console.log("body : " + JSON.stringify(req.body));
      let c = req.body;
      // try {
      //   if(!...c) console.log("No inputs");
      // } catch(e) {

      // }
      

      if(!c.Nimi || !c.Osoite || !c.Postinro || !c.Postitmp || !c.Asty_avain) return res.json({error:"No eipä onistunu voi voi", status:"ruikkari"});
      // php : name = my_real_escape(c.Nimi)

      connection.query('INSERT INTO Asiakas (Nimi, Osoite, Postinro, Postitmp, Luontipvm, Asty_avain) VALUES (?, ?, ?, ?, CURDATE(), ?)', [c.Nimi, c.Osoite, c.Postinro, c.Postitmp, c.Asty_avain],
        function (error, results, fields) {
          if (error) {
            console.log("Error when inserting data to db, reason: " + error);
            res.json(error);
          }
          else {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 201;
            c.Avain = results.insertId;
            res.json(c);
          }
        });
    },
 
    update: function (req, res) {
      console.log("------------------");
      console.log("UPDATE");
      console.log("body: " + JSON.stringify(req.body));
      console.log("params: " + JSON.stringify(req.params));

      let  c = req.body;
      //UPDATE `table_name` SET `column_name` = `new_value' [WHERE condition]
      connection.query('UPDATE Asiakas SET NIMI = "' + c.Nimi + '", OSOITE = "' + c.Osoite + '", POSTINRO = "' + c.Postinro + '", POSTITMP = "' + c.Postitmp + '" WHERE AVAIN='+req.params.id,
        function (error, results, fields) {
          if (error) {
            console.log("Error when inserting data to db, reason: " + error);
            res.json(error);
          }
          else {
            console.log("Data = " + JSON.stringify(results));
            res.statusCode = 201;            
            res.json(c);
          }
        });
    },

    delete: function (req, res) {
      console.log("------------------");
      console.log("DELETE");
      console.log("params: " + JSON.stringify(req.params));

      let query = 'DELETE FROM asiakas WHERE avain='+req.params.id;

      connection.query(query, function (error, results, fields) {
        console.log("Debug in connection query");
        if (error) {
          console.log("Error removing data from db, reason: " + error);
          //res.send(error);
          res.statusCode = 500;
          res.send({ code: "NOT OK", error_msg: error, data: "" });
        }
        else {
          console.log("Data = " + JSON.stringify(results));
          res.statusCode = 200;
          res.send(results);

          //res.send({code: "OK", error_msg : "", data : results});
        }
      });
    }
  }