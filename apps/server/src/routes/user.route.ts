import express from 'express';
import {
  acceptFriendRequest,
  addFriendRequest,
  cancelFriendRequest,
  getCurrentUser,
  getUsers,
  rejectFriendRequest,
  removeFriend,
  signIn,
  signout,
  signup,
} from '../controllers/user.controller';
import protectRoute from '../middelwares/protectRoute';
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signIn);
router.get('/logout', signout);
router.get('/current_user', protectRoute, getCurrentUser);
router.post('/add', protectRoute, addFriendRequest);
router.post('/accept', protectRoute, acceptFriendRequest);
router.post('/reject', protectRoute, rejectFriendRequest);
router.post('/cancel', protectRoute, cancelFriendRequest);
router.get('/', protectRoute, getUsers);
router.post('/remove', protectRoute, removeFriend);

export default router;
