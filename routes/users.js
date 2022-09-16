const UserController = require("../controllers/user.controller.js")

var router = require("express").Router()

// Create a new Tutorial
router.post("/", UserController.create)

// Retrieve all Tutorials
router.get("/", UserController.findAll)

// Retrieve all published Tutorials
router.get("/published", UserController.findAllPublished)

// Retrieve a single Tutorial with id
router.get("/:id", UserController.findOne)

// Update a Tutorial with id
router.put("/:id", UserController.update)

// Delete a Tutorial with id
router.delete("/:id", UserController.delete)

// Create a new Tutorial
router.delete("/", UserController.deleteAll)

module.exports = router
