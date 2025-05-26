const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const UserProgress = require("../models/UserProgress");
const Course = require("../models/Course");
const { auth } = require("../middleware/auth");

// Get user's progress for all courses
router.get("/", auth, async (req, res) => {
  try {
    const progress = await UserProgress.find({ user: req.user._id })
      .populate("course", "title description thumbnail")
      .sort({ lastAccessed: -1 });
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get progress for specific course
router.get("/:courseId", auth, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      user: req.user._id,
      course: req.params.courseId,
    }).populate("course", "title description thumbnail");

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Save progress for a chapter
router.post(
  "/:courseId/chapter/:chapterId",
  auth,
  [body("attempts").isArray(), body("completed").isBoolean()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { attempts, completed } = req.body;
      const courseId = req.params.courseId;
      const chapterId = req.params.chapterId;

      // Find or create progress document
      let progress = await UserProgress.findOne({
        user: req.user._id,
        course: courseId,
      });

      if (!progress) {
        // Get course structure to initialize progress
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }

        // Initialize progress structure
        progress = new UserProgress({
          user: req.user._id,
          course: courseId,
          sections: course.sections.map((section) => ({
            sectionId: section._id,
            units: section.units.map((unit) => ({
              unitId: unit._id,
              chapters: unit.chapters.map((chapter) => ({
                chapterId: chapter._id,
              })),
            })),
          })),
        });
      }

      // Update chapter progress
      const section = progress.sections.find((s) =>
        s.units.some((u) =>
          u.chapters.some((c) => c.chapterId.toString() === chapterId)
        )
      );

      if (!section) {
        return res
          .status(404)
          .json({ message: "Chapter not found in course structure" });
      }

      const unit = section.units.find((u) =>
        u.chapters.some((c) => c.chapterId.toString() === chapterId)
      );

      const chapter = unit.chapters.find(
        (c) => c.chapterId.toString() === chapterId
      );

      chapter.attempts = attempts;
      chapter.completed = completed;
      chapter.lastAccessed = new Date();

      // Update unit and section completion status
      unit.completed = unit.chapters.every((c) => c.completed);
      section.completed = section.units.every((u) => u.completed);

      // Calculate overall progress
      const totalChapters = progress.sections.reduce(
        (acc, section) =>
          acc +
          section.units.reduce((acc, unit) => acc + unit.chapters.length, 0),
        0
      );

      const completedChapters = progress.sections.reduce(
        (acc, section) =>
          acc +
          section.units.reduce(
            (acc, unit) =>
              acc + unit.chapters.filter((c) => c.completed).length,
            0
          ),
        0
      );

      progress.overallProgress = (completedChapters / totalChapters) * 100;
      progress.lastAccessed = new Date();
      progress.completed = progress.overallProgress === 100;

      await progress.save();
      res.json(progress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
