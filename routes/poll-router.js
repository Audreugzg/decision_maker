const express = require('express');
const router  = express.Router();
const pollQueries = require('../db/poll-queries'); // ADD DB QUERIES

  router.get("/create", (req, res) => {
    res.render("form");
  });
  router.post("/create", (req, res) => {
    pollQueries.createPoll()
  });
  router.get("/:id", (req, res) => {
    pollQueries.getPollResult(req.params.id)
      .then((result) => {
        res.json(result);
      })
  });

module.exports = router;
