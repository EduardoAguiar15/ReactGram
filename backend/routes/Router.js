const express = require("express");
const router = express.Router(); 

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));
router.use("/api/conversations", require("./ConversationRoutes"));
router.use("/api/messages", require("./MessageRoutes"));
router.use("/api/comments", require("./CommentsRoutes"));

// test route
router.get("/", (req, res) => {
    res.send("API WORKING!");
});

module.exports = router