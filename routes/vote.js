const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/:key", (req, res) => {
    let poll_key = { poll_key: req.params.key };
    db.query(`SELECT titles.title, options.choice
    FROM options
    JOIN users ON users.id = options.user_id
    JOIN titles ON users.id = titles.user_id
    WHERE users.poll_key = $1;`, [poll_key.poll_key])
    .then(data => {
        const title = data.rows[0].title;
        let question = [];
        for (const i of data.rows) {
          question.push(i.choice);
        }
        console.log(title);
        console.log(question);
        const info = {title:title, questions: question};
        console.log(info);
        //res.json({ info });
        res.render("vote",info);
    })
  });
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
  return router;
};

