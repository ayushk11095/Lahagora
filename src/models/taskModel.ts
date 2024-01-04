import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
    },
    userUUID: {
        type: String,
        trim: true,
        required: true,
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
})

const Task = mongoose.model("tasks", TaskSchema)

module.exports = Task