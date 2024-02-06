const router = require('express').Router();

const projectsCtrl = require("../Controllers/Projects");
const authUser = require("./authUser");
const authAdmin = require("./authAdmin");

router.get("/", authUser, projectsCtrl.getProjects);
router.get("/:id", authUser, projectsCtrl.getOneProject);

router.put("/change-status", authAdmin, projectsCtrl.changeStatus);

module.exports = router;
