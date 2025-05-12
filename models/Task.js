import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'high', 'urgent'],
    default: 'low'
  }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
