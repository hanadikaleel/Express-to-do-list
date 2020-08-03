var mongoose = require('mongoose');

var taskListSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('TaskList', taskListSchema);
