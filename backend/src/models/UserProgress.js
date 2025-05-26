const mongoose = require("mongoose");

const questionAttemptSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const chapterProgressSchema = new mongoose.Schema({
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  attempts: [questionAttemptSchema],
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

const unitProgressSchema = new mongoose.Schema({
  unitId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  chapters: [chapterProgressSchema],
  completed: {
    type: Boolean,
    default: false,
  },
});

const sectionProgressSchema = new mongoose.Schema({
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  units: [unitProgressSchema],
  completed: {
    type: Boolean,
    default: false,
  },
});

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    sections: [sectionProgressSchema],
    overallProgress: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
userProgressSchema.index({ user: 1, course: 1 }, { unique: true });

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

module.exports = UserProgress;
