const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["mcq", "fillInBlank", "text", "audio"],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  media: {
    type: String, // URL to media file
  },
});

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  order: {
    type: Number,
    required: true,
  },
});

const unitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  chapters: [chapterSchema],
  order: {
    type: Number,
    required: true,
  },
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  units: [unitSchema],
  order: {
    type: Number,
    required: true,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    sections: [sectionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
courseSchema.index({ title: "text", description: "text" });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
