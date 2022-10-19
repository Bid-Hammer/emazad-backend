"use strict";
const express = require("express");
const router = express.Router();
const { Report } = require("../models");

router.get("/report", getReport);
router.post("/report", createReport);
router.delete("/report/:id", deleteReport);
router.get("/report/:id", getOneReport);

async function getReport(req, res) {
  let report = await Report.read();
  res.status(200).json(report);
}

async function getOneReport(req, res) {
  const id = req.params.id;

  let getOneReport = await Report.read(id);
  res.status(200).json({ getOneReport });
}

async function createReport(req, res) {
  let newReport = req.body;
  let report = await Report.create(newReport);
  res.status(201).json(report);
}

async function deleteReport(req, res) {
  const id = req.params.id;
  let deletedReport = await Report.delete(id);
  res.status(204).send("deleted ");
}



module.exports = router;
