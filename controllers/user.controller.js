const db = require("../models") // models path depend on your structure
const bcrypt = require("bcryptjs")
const User = db.users
const { Op } = require("sequelize")

exports.create = async (req, res) => {
  try {
    const { first_name, last_name, username, phone, role, currentPlan, avatar, status } = req.body
    const email = req.body.email.toLowerCase()

    let checkUser = await User.findOne({ where: { email } })
    if (checkUser) {
      return res
        .status(200)
        .json({ error: { email: "This email is already in use." } })
    }

    checkUser = await User.findOne({ where: { username } })
    if (checkUser) {
      return res
        .status(200)
        .json({ error: { username: "This username is already in use." } })
    }

    const enryptedPWD = await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD, 10)

    await User.create({
      first_name,
      last_name,
      username,
      email,
      role,
      phone,
      avatar,
      password: enryptedPWD,
    })

    return res.status(200).send("success")
  } catch (error) {
    console.log(error)
    return res.status(400).send("fail")
  }
}

exports.findAll = (req, res) => {
  const {
    page = 1,
    role = null,
    perPage = 10,
    sort = "asc",
    status = null,
    currentPlan = null,
    sortColumn = "first_name",
  } = req.query
  
  const search = req.query.q.toLowerCase()

  var condArr = Array()

  if (role != null && role != "") condArr.push({ role })
  // if (currentPlan != null && currentPlan != "") condArr.push({ currentPlan })
  // if (status != null && status != "") condArr.push({ status })

  var condition = {
    [Op.or]: [
      { first_name: { [Op.like]: `%${search}%` } },
      { last_name: { [Op.like]: `%${search}%` } },
      { username: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ],
  }

  if (condArr.length > 0) condition[Op.and] = condArr

  User.findAndCountAll({
    logging: (sql, queryObject) => {
      console.log("----------- Excuted Find All Query ---------- \n", sql)
    },
    where: condition,
    limit: parseInt(perPage),
    offset: (parseInt(page) - 1) * parseInt(perPage),
    order: [[sortColumn, sort]],
  })
    .then((data) => {
      // console.log(data.count)
      // console.log(data.rows)
      res.send({
        users: data.rows,
        total: data.count,
      })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials",
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  User.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        })
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        })
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      })
    })
}

exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      })
    })
}

exports.findAllPublished = (req, res) => {
  User.findAll({ where: { published: true } })

    .then((data) => {
      res.send(data)
    })

    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      })
    })
}
