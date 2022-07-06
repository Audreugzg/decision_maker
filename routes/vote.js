<<<<<<< HEAD
/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');

=======
const express = require('express');
const router = express.Router();
>>>>>>> cc42a761520863a51bd21a48bca4d9b38a73ab72

module.exports = (db) => {
  router.get("/:key", (req, res) => {
    let poll_key = { poll_key: req.params.key };
<<<<<<< HEAD
    console.log(poll_key);
    db.query(`SELECT titles.title, options.choice,options.description
=======
    db.query(`SELECT titles.title, options.choice
>>>>>>> cc42a761520863a51bd21a48bca4d9b38a73ab72
    FROM options
    JOIN users ON users.id = options.user_id
    JOIN titles ON users.id = titles.user_id
    WHERE users.poll_key = $1;`, [poll_key.poll_key])
    .then(data => {
        const title = data.rows[0].title;
        let question = [];
<<<<<<< HEAD
        let description=[];
        for (const i of data.rows) {
          question.push(i.choice);
          description.push(i.description);
        }
        console.log(title);
        console.log(question);
        const info = {title:title, questions: question, description:description, poll_key:poll_key.poll_key};
=======
        for (const i of data.rows) {
          question.push(i.choice);
        }
        console.log(title);
        console.log(question);
        const info = {title:title, questions: question};
>>>>>>> cc42a761520863a51bd21a48bca4d9b38a73ab72
        console.log(info);
        //res.json({ info });
        res.render("vote",info);
    })
  });
<<<<<<< HEAD

  router.post("/:key", (req, res) => {
    let poll_key = {poll_key:req.params.key};
    db.query(`SELECT users.email,titles.title
    FROM users
    JOIN titles ON users.id = titles.user_id
    WHERE users.poll_key = $1;`,[poll_key.poll_key])
    .then(data => {
      const email = data.rows[0].email;
      const title = data.rows[0].title;
      console.log(email);

      var transport = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, //ssl
        auth: {

            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: 'decisionmakerapp007@zohomail.com',
        to: email,
        subject: `your friends just voted on your poll`,
        text: `
        Hello!
        your friend has just voted on your poll: ${title}. Click below to see the updated results.
        Admin Link: http://localhost:8080/api/result/${poll_key.poll_key}
        Share the link below to get more responses.
        Voting Link: http://localhost:8080/api/vote/${poll_key.poll_key}
        Thank you!`
    };

    transport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    })


  });


=======
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM options`)
      .then(data => {
        const i = data.rows;
        res.json({ i });
      })
  });

  router.post("/:key", (req, res) => {
    console.log(req.body);
    let poll_key = { poll_key: req.body.poll_key };
    const choices = req.body.optionOrders;
      choices.forEach(item => {
        db.query(`SELECT id, title_id FROM options
                  WHERE options.choice LIKE $1;`, [item])
        .then(data => {
          const optionId = data.rows[0].id;
          const titleID = data.rows[0].title_id;
          const score = choices.indexOf(item);
          console.log(optionId);
          console.log(titleID);
          console.log(score);
          db.query(`INSERT INTO choices
            (option_id, title_id, score) VALUES ($1, $2, $3);`, [optionId, titleID, score])
            .catch(err => {
              res
                .status(500)
                .json({ error: err.message });
            });
      })
      })
  });
>>>>>>> cc42a761520863a51bd21a48bca4d9b38a73ab72
  return router;
};

