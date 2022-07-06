const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    res.send('hello');
    // const pollId = req.params.id;
    // db.query(
    //   `SELECT COUNT(option_id) FROM choices
    //   WHERE title_id = $1 GROUP BY option_id;`,
    //   [pollId])
    // .then(data => {
    //   const resultNumber = data.rows[0].length
    //   db.query(`SELECT SUM(score) FROM choices
    //   WHERE option_id = $1 AND title_id = $2`, [item])
    //     .then(data => {
    //       const users = data.rows;
    //       res.render("index");
    //     })
  });
  //Posgres query to count number of choices = n
  //loop n times with a query to sum the score of that choice
  //send the data to the front-end to appear on the webste
  //poll name, poll choices and their overal rank
  //options should appear top to bottom from highest ranked to lowest

  // });
  return router;
};
