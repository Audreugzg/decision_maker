const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    //let poll_key = { poll_key: req.params.key };
    //console.log(poll_key);
    //console.log(req.body);
    // info = req.body;
    let poll_key = { poll_key: req.body.key };
    const choices = req.body.optionOrders;
    //console.log('choices', choices);
    let length = choices.length;
    console.log('choices_length', length);

    // res.json({ info });
    // res.redirect('/api/results',info);
    choices.forEach((item) => {
      //console.log('length', length);
      const score = length;
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

        //console.log(optionId);
        //console.log(titleID);
        //console.log(score);
        db.query(
          `INSERT INTO choices
        (option_id, title_id, score) VALUES ($1, $2, $3);`,
          [optionId, titleID, score]
        ).catch((err) => {
          res.status(500).json({ error: err.message });
        });


      });
      length = length - 1;
    });
  });
  router.get("/:key", (req, res) => {

    let poll_key = { poll_key: req.params.key };



    db.query(
      `SELECT titles.title, choices.score as score, options.choice as option
        FROM choices
        JOIN options ON options.id = choices.option_id
        JOIN titles ON titles.id = options.title_id
        JOIN users ON users.id = titles.user_id
        WHERE users.poll_key = $1;`,
      [poll_key.poll_key]
    ).then((data) => {
      let option = [];
      let score = [];
      //res.json({info});
      const title = data.rows[0].title;
      for (const i of data.rows) {
        option.push(i.option);
        score.push(i.score);
      }
      let total = score.reduce((a, b) => a + b, 0);
      //console.log(option);
      //console.log(score);
      //console.log(total);
      let uniqueOp = [];
      option.forEach((c) => {
        if (!uniqueOp.includes(c)) {
          uniqueOp.push(c);
        }
      });
      console.log(uniqueOp);
      let rel = [];
      let percent=[];
      for (const z in uniqueOp) {
        rel.push([]);
        percent.push([]);
      }
      for (const x in option) {
        for (const y in uniqueOp) {
          if (option[x] === uniqueOp[y]) {
            rel[y].push(score[x]);
          }
        }

      }
      for (const op in rel) {
        rel[op] = rel[op].reduce((a, b) => a + b, 0);
      }
      // console.log('rel',rel);
      for (const key in rel) {
        percent[key] = (rel[key]/total*100).toFixed(1);
      }
      console.log('per',percent);










      const info = {
        title: title,
        options: uniqueOp,
        percent:percent

      };
      //console.log(info);

      res.render("results",info);
    });

    // res.render('complete', poll_key.poll_key)
  });
  return router;
};
