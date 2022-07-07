const express = require("express");
const router = express.Router();
var nodemailer = require("nodemailer");

module.exports = (db) => {
  router.get("/:key", (req, res) => {
    let poll_key = { poll_key: req.params.key };
    db.query(
      `SELECT titles.title, options.choice,options.description
    FROM options
    JOIN users ON users.id = options.user_id
    JOIN titles ON users.id = titles.user_id
    WHERE users.poll_key = $1;`,
      [poll_key.poll_key]
    ).then((data) => {
      const title = data.rows[0].title;
      let question = [];
      let description = [];
      for (const i of data.rows) {
        question.push(i.choice);
        description.push(i.description);
      }
      console.log(title);
      console.log(question);
      const info = {
        title: title,
        questions: question,
        description: description,
        poll_key: poll_key.poll_key,
      };
      console.log(info);
      //res.json({ info });
      res.render("vote", info);
    });
  });

  router.post("/:key", (req, res) => {
    console.log(req.body);
    let poll_key = { poll_key: req.body.key };
    const choices = req.body.optionOrders;
    let length = choices.length;
    let optionsindices = [];
    for (item of choices) {
      optionsindices.push(choices.indexOf(item));
    }
    const scores = optionsindices.reverse();
    choices.forEach(async (item) => {
      db.query(
        `SELECT options.id, options.title_id, users.email,
        titles.title
        FROM users
        JOIN titles ON users.id = titles.user_id
        JOIN options ON titles.id = title_id
        WHERE options.choice = $1 AND poll_key = $2;`,
          [item, poll_key.poll_key]
      ).then((data) => {
        const optionId = data.rows[0].id;
        const titleID = data.rows[0].title_id;
        const email = data.rows[0].email;
        const title = data.rows[0].title;
        const score = scores[choices.indexOf(item)];
        db.query(
          `INSERT INTO choices
        (option_id, title_id, score) VALUES ($1, $2, $3);`,
          [optionId, titleID, score]
        ).catch((err) => {
          res.status(500).json({ error: err.message });
        })

        if (length > 1) {
          length = length - 1;
        } else {
          var transport = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true, //ssl
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });

          var mailOptions = {
            from: "decisionmakerapp007@zohomail.com",
            to: email,
            subject: `your friends just v  console.log(optionOrders);oted on your poll`,
            text: `
            Hello!
            your friend has just voted on your poll: ${title}. Click below to see the updated results.
            Admin Link: http://localhost:8080/api/result/${poll_key.poll_key}
            Share the link below to get more responses.
            Voting Link: http://localhost:8080/api/vote/${poll_key.poll_key}
            Thank you!`,
          };
          transport.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        }
      }).catch((err) => {
        console.log(err.message);
      });
    })
    res.render('results', {key: 'rende result page'});
  });
  return router;
};
