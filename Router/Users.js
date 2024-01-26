const router = require('express').Router();

const userCtrl = require("../Controllers/Users");
const authUser = require("./authUser");
const authAdmin = require("./authAdmin");

router.post("/login", userCtrl.login);
router.post("/login-admin", userCtrl.loginAdmin);

router.get("/dashboard", authUser, userCtrl.dashboard);
router.get("/dashboard-admin", authAdmin, userCtrl.dashboard);
router.get("/all", authAdmin, userCtrl.getAllUsers);

router.post("/create-project", authUser, userCtrl.sendProject);
router.post("/create", authAdmin, userCtrl.createOneUsers);

module.exports = router;
