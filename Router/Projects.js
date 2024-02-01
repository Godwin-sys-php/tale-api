const router = require('express').Router();

const projectsCtrl = require("../Controllers/Projects");
const authUser = require("./authUser");
const authAdmin = require("./authAdmin");

router.get("/", authUser, projectsCtrl.getProjects);
router.get("/:id", authUser, projectsCtrl.getOneProject);

module.exports = router;
