const Projects = require("../Models/Projects");
require("dotenv").config();

exports.getProjects = async (req, res,) => {
  try {
    console.log("jf");
    const projects = await Projects.customQuery(
      "SELECT * FROM projects ORDER BY id DESC",
      [],
    );

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}

exports.getOneProject = async (req, res,) => {
  try {
    console.log("jf");
    const projects = await Projects.customQuery(
      "SELECT * FROM projects WHERE id = ?",
      [req.params.id],
    );

    const file = Projects.customQuery("SELECT * FROM projectFiles WHERE projectId = ?", [req.params.id]);

    let response = {...projects[0]};
    if (file.length > 0) {
      response.file = file[0];
    }

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Une erreur inconnue a eu lieu" });
  }
}