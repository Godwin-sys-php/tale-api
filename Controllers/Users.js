const moment = require("moment");
const Events = require("../Models/Events");
const Projects = require("../Models/Projects");
const Transactions = require("../Models/Transactions");
const Users = require("../Models/Users");
const jwt = require("jsonwebtoken");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Admins = require("../Models/Admins");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await Users.findOne({ code: code });
    if (user.length === 0) {
      return res.status(400).json({ logged: false, message: "Code incorrect" });
    } else {
      return res.status(200).json({
        logged: true,
        userInfo: user[0],
        token: jwt.sign({ ...user[0] }, process.env.TOKEN, {
          expiresIn: 604800 * 30, // 30 weeks
        }),
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await Admins.findOne({ code: code });
    if (user.length === 0) {
      return res.status(400).json({ logged: false, message: "Code incorrect" });
    } else {
      return res.status(200).json({
        logged: true,
        userInfo: user[0],
        token: jwt.sign({ ...user[0] }, process.env.TOKEN_ADMIN, {
          expiresIn: 604800 * 30, // 30 weeks
        }),
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.customQuery(
      "SELECT * FROM users ORDER BY name DESC"
    );

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.createOneUsers = async (req, res) => {
  try {
    const user = await Users.findOne({ code: req.body.code, });
    if (user.length > 0) {
      return res.status(400).json({ exist: true, message: "Ce code est déjà porté par un autre utilistateur" })
    }
    const toInsert = {
      name: req.body.name,
      isTerm: req.body.isTerm,
      code: req.body.code,
    }

    await Users.insertOne(toInsert);
    
    const users = await Users.customQuery(
      "SELECT * FROM users ORDER BY name DESC"
    );

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const caisse = await Transactions.customQuery(
      "SELECT * FROM transactions ORDER BY id DESC LIMIT 1"
    );
    const projects = await Projects.findOne({ published: true });
    const events = await Events.findOne({ published: true });

    return res.status(200).json({
      success: true,
      data: { caisse: caisse[0].after, projects: projects, events: events },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};

exports.sendProject = async (req, res) => {
  try {
    const now = moment();
    console.log(req.body);
    const { name, date, dateDeVote, description } = req.body;

    const insert = await Projects.insertOne({
      userId: req.user.id,
      userName: req.user.name,
      name,
      date,
      dateDeVote,
      description,
      timestamp: now.unix(),
    });

    if (req.files && req.files.file) {
      const file = req.files.file;
      const filename = uuidv4() + path.extname(file.name);

      file.mv(path.join(__dirname, "../uploads", filename), async (err) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: true, message: "Une erreur inconnue a eu lieu" });
        }

        await Projects.customQuery(
          "INSERT INTO projectFiles SET projectId = ?, url = ?",
          [insert.insertId, filename]
        );
        res.status(200).json({ success: true });
      });
    } else {
      // Si aucun fichier n'est fourni, vous pouvez renvoyer la réponse ici
      res
        .status(200)
        .json({
          success: true,
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
};
