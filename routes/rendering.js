const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render("index");
  });

  router.get("/form", (req, res) => {
    res.render("form");
  });

  router.get("/vote", (req, res) => {
    res.render("vote");
  });

  router.get("/results", (req, res) => {
    res.render("results");
  });

  router.get("/complete", (req, res) => {
    let poll_key = { poll_key: req.params.key };
    const voteUrl = `api/vote/${poll_key}`;
    const resultUrl = `api/result/${poll_key}`;
    const templateVariables = { voteUrl, resultUrl };
    res.render("complete", templateVariables);
  });

  router.get("/test", (req, res) => {
    console.log("sunnyday");
    res.render('test');
  });

  router.get("/polls/:id", (req, res) => {
    let pollKey = req.params.id;
    db.query(
      `SELECT titles.title AS poll_title,
    SUM(score) AS sum, COUNT(score) AS totalnumberofvoters,
    options.choice AS options, users.name AS pollcreator
    FROM choices
    JOIN options ON options.id = choices.option_id
    JOIN users ON users.id = user_id
    JOIN titles on users.id = titles.user_id
    WHERE poll_key = $1
    GROUP BY poll_title, option_id, options.choice, users.name
    ORDER BY sum ASC;`,
      [pollKey]
    )
      .then((data) => {
        console.log(data.rows[0]);
        const pollTitle = data.rows[0].poll_title;
        console.log(pollTitle);
        const numberOfVoters = data.rows[0].totalnumberofvoters;
        console.log(numberOfVoters);
        const pollCreator = data.rows[0].pollcreator;
        console.log(pollCreator);
        let pollOptionScores = [];
        const templateVariables = {
          pollTitle,
          pollCreator,
          numberOfVoters,
          pollOptionScores,
        };
        for (item of data.rows) {
          pollOptionScores.push({ option: item.options, totalScore: item.sum });
        }
        console.log(pollOptionScores);
        res.render("result", templateVariables);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};

router.post("/completed/:id", (req, res) => {
  return router;
});
