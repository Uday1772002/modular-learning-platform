const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Course = require("../models/Course");
const { auth, adminAuth } = require("../middleware/auth");

// Get all courses
router.get("/", auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("createdBy", "email")
      .select("-sections.units.chapters.questions.correctAnswer");
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single course
router.get("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "email")
      .select("-sections.units.chapters.questions.correctAnswer");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create course (admin only)
router.post(
  "/",
  adminAuth,
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("sections").isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const course = new Course({
        ...req.body,
        createdBy: req.user._id,
      });

      await course.save();
      res.status(201).json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update course (admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the creator
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete course (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the creator
    if (course.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await course.remove();
    res.json({ message: "Course removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Enroll in course
router.post("/:id/enroll", auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already enrolled
    if (course.enrolledUsers.includes(req.user._id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    course.enrolledUsers.push(req.user._id);
    await course.save();

    res.json({ message: "Successfully enrolled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
