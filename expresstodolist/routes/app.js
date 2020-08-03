var express = require("express");
var app = express();
var router = express.Router();
var mongoose = require("mongoose");
var TaskList = require("../models/TaskList");


//APP ROUTES

router.get("/", (req, res) => {
  TaskList.find({}, (err, tasks) => {
    res.render("todo.ejs", {
      taskList: tasks,
    });
  });
});

router.post("/", async (req, res) => {
  var taskList = new TaskList({
    content: req.body.content,
  });
  try {
    await taskList.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

router
  .route("/edit/:id")
  .get((req, res) => {
    var id = req.params.id;
    TaskList.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", {
        todoTasks: tasks,
        idTask: id,
      });
    });
  })
  .post((req, res) => {
    var id = req.params.id;
    TaskList.findByIdAndUpdate(
      id,
      {
        content: req.body.content,
      },
      (err) => {
        if (err) return res.send(500, err);
        res.redirect("/");
      }
    );
  });

router
  .route("/tasks/:id")
  .get((req, res) => {
    var id = req.params.id;
    TaskList.findById({}, (err, tasks) => {
      res.json(tasks);
    });
  })
  .put((req, res) => {
    var id = req.params.id;
    TaskList.findByIdAndUpdate(
      id,
      {
        content: req.body.content,
      },
      (err) => {
        if (err) return res.send(500, err);
        res.redirect("/");
      }
    );
  });
router.route("/tasks/:id").get(function (req, res) {
  TaskList.findById(req.params.TaskList_id, function (err, task) {
    if (err) res.send(err);
    res.json(task);
  });
});

router.route("/remove/:id").get((req, res) => {
  var id = req.params.id;
  TaskList.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});

router.use((req, res, next)=>{
  res.set({
    // allow any domain, allow REST methods we've implemented
    'Access-Control-Allow-Origin': req.get('Origin') || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,OPTIONS',
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers",
    // Set content-type for all api requests
    'Content-type':'application/json'
  });
  if (req.method == 'OPTIONS'){
    return res.status(200).end();
  }
  next();
});


//API ROUTES //

//GET
router.route("/api/tasks").get(function (req, res) {
  TaskList.find(function(err, tasks){
    if (err)
    res.send(err);
    res.json(tasks);
  });

});

//POST
router.route("/api/tasks").post(function (req, res) {
  const task = new TaskList();
  task.content = req.body.content;
  task.save(function (err) {
    if (err) res.send(err);
    res.json({ message: "task created" });
  });
});

//GET ONE TASK
router.route("/api/tasks/:TaskList_id").get((req, res) => {
  TaskList.findById(req.params.TaskList_id, function (err, task) {
    if (err) res.send(err);
    res.json(task);
  });
});

//PUT
router.route("/api/tasks/:TaskList_id").put(function (req, res) {
  TaskList.findById(req.params.TaskList_id, function (err, task) {
    if (err) res.send(err);
    task.content = req.body.content;
    task.save(function (err) {
      if (err) res.send(err);
      res.json({ message: "Task updated!" });
    });
  });
});

router.route("/api/tasks/:TaskList_id").delete(function(req, res) {
  TaskList.remove({
      _id: req.params.TaskList_id
  }, function(err, task) {
      if (err)
          res.send(err);

      res.json({ message: 'Successfully deleted task' });
  });
});


module.exports = router;
