import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { User } from '../schemas/UserSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const usersRouter = Router();

// Create user
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  async (request, response) => {
    const { name, email, password } = request.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return response.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  },
);

// Update user
usersRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  async (request, response) => {
    const { name, email, old_password, password } = request.body;
    const user_id = request.user.id;

    const user = await User.findById(user_id);

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    const userWithUpdatedEmail = await User.findOne({ email });

    if (userWithUpdatedEmail && userWithUpdatedEmail._id.toString() !== user_id) {
      return response.status(400).json({ error: 'Email already in use' });
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      return response.status(400).json({ error: 'Old password is required' });
    }

    if (password && old_password) {
      const checkOldPassword = await bcrypt.compare(old_password, user.password);

      if (!checkOldPassword) {
        return response.status(400).json({ error: 'Old password does not match' });
      }

      user.password = await bcrypt.hash(password, 8);
    }

    await user.save();

    return response.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  },
);

// Get user profile
usersRouter.get('/profile', async (request, response) => {
  const user_id = request.user.id;

  const user = await User.findById(user_id);

  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  return response.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
});

export default usersRouter; 