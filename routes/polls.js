const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:key", (req, res) => {
    let poll_key = {poll_key:req.params.key};
    db.query(`SELECT * FROM users
    WHERE users.poll_key = $1;`,[poll_key.poll_key])
      .then(data => {
        res.render("form",poll_key);
      })
  });
  router.post("/:key", (req, res) => {
    let title = req.body.title;
    let poll_key = {poll_key:req.params.key};
    let options = req.body.op;
    let descriptions = req.body.description;
    db.query(`SELECT * FROM users
    WHERE users.poll_key = $1;`,[poll_key.poll_key])
    .then(data => {
      const id = data.rows[0].id;
      poll_key={...poll_key,user_id:id};
      console.log(poll_key)
      return db
      .query(`INSERT INTO titles(title,user_id)
               VALUES($1,$2)
               RETURNING *;`, [title,poll_key.user_id])
      .then((result) => {
        if (!Array.isArray(options)) {
          return db
          .query(`INSERT INTO options(user_id,title_id,choice,description)
          VALUES($1,$2,$3,$4)
          RETURNING *;`, [result.rows[0].user_id,result.rows[0].id,options,descriptions])
          .then(()=>{
            res.render(`complete`);

          });

        }else{
          options.forEach((option, index) => {
            return db
            .query(`INSERT INTO options(user_id,title_id,choice,description)
            VALUES($1,$2,$3,$4)
            RETURNING *;`, [result.rows[0].user_id,result.rows[0].id,option,descriptions[index]])
          });
        }
        res.render('complete', poll_key);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    })
  });
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM options`)
      .then(data => {
        const i = data.rows;
        res.json({i});
      })
  });
  return router;
};

