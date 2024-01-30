const router = require('express').Router();

const projectsCtrl = require("../Controllers/Projects");
const authUser = require("./authUser");
const authAdmin = require("./authAdmin");

router.get("/", authAdmin, projectsCtrl.getProjects);
router.get("/:id", authAdmin, projectsCtrl.getOneProject);

module.exports = router;
