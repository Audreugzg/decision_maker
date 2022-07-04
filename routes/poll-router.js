const express = require('express');
const router  = express.Router();
const pollQueries = require('../db/poll-queries'); // ADD DB QUERIES

  router.get("/create", (req, res) => {
    res.render("form");
  });
  router.post("/create", (req, res) => {
    const pollTitle = req.body.pollTitle;
    const pollOption1 = req.body.option1;
    const formData = {title: pollTitle, option1: pollOption1}
    pollQueries.createPoll(formData)
      .then((result) => {
        const adminLink = result.rows[0].admin
        const voteLink = result.rows[0].vote
        const templateVars = {admin: adminLink,
           vote: voteLink}
        res.render("submitted", templateVars);
      })
  });
  router.get("/:id", (req, res) => {
    pollQueries.getPollResult(req.params.id)
      .then((result) => {
        res.json(result);
      })
  });

module.exports = router;
