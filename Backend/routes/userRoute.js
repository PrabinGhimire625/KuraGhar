import { Router } from "express";
import { fetchAllUser, fetchSingleUser, login, profile, register, searchUsers, updateUser } from "../controller/userController.js";
import upload from "../middleware/multer.js"
import { isAuthenticated } from "../middleware/authMiddleware.js";
const router = Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/profile").get(isAuthenticated, profile)
router.route("/profile/update").patch(isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 }]), updateUser); 

router.route("/allUser").get(fetchAllUser)
router.route("/singleUser/:id").get(fetchSingleUser)

router.route("/search").get(searchUsers)

export default router;