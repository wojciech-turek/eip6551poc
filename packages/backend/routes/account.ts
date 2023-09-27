import { Router } from 'express';
import User from '../models/User';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send('User not found');
  }

  if (user.password !== password) {
    return res.status(400).send('Invalid password');
  }

  res.json({ message: 'Success', user });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  await user.save();
  res.send('User created');
});

router.patch('/updateWalletAddress', async (req, res) => {
  const { email, walletAddress } = req.body;

  const user = await User.findOneAndUpdate(
    { email },
    { walletAddress },
    { new: true }
  );

  if (!user) {
    return res.status(400).send('User not found');
  }

  res.json({ message: 'Success', user });
});

router.post('/me', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    // return an error
    return res.status(400).send('User not found');
  res.send(user);
});

export default router;
