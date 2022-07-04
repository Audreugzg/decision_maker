/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

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

  // router.post("/:key", (req, res) => {
  //   console.log(req.body);
  //   let title = req.body.title;
  //   let poll_key = {poll_key:req.params.key};
  //   let options = req.body.op;
  //   let descriptions = req.body.description;
  //   db.query(`SELECT * FROM users
  //   WHERE users.poll_key = $1;`,[poll_key.poll_key])
  //   .then(data => {
  //     const id = data.rows[0].id;
  //     poll_key={...poll_key,user_id:parseInt(id)};
  //     return db
  //     .query(`INSERT INTO titles(title,user_id)
  //              VALUES($1,$2)
  //              RETURNING *;`, [title,poll_key.user_id])
  //     .then((result) => {
  //       console.log(result.rows);
  //       console.log(options);
  //       if (!Array.isArray(options)) {
  //         return db
  //         .query(`INSERT INTO options(user_id,title_id,choice,description)
  //         VALUES($1,$2,$3,$4)
  //         RETURNING *;`, [result.rows[0].user_id,result.rows[0].id,options,descriptions])
  //         .then(()=>{
  //           res.render(`thanks`);

  //         });

  //       }else{
  //         options.forEach((option, index) => {
  //           return db
  //           .query(`INSERT INTO options(user_id,title_id,choice,description)
  //           VALUES($1,$2,$3,$4)
  //           RETURNING *;`, [result.rows[0].user_id,result.rows[0].id,option,descriptions[index]])

  //         });
  //       }





  //       res.render(`thanks`);
  //     })

  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  //   })


  // });

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM options`)
      .then(data => {
        const i = data.rows;
        res.json({ i });
      })
  });

  return router;
};
