const User = require('../models/User');
const AuthUtils = require('../utils/auth');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName, role, school } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists'
        });
      }

      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        role,
        school
      });

      await user.save();

      // Generate tokens
      const accessToken = AuthUtils.generateToken({
        userId: user._id,
        role: user.role,
        permissions: AuthUtils.getRolePermissions(user.role)
      });

      const refreshToken = AuthUtils.generateRefreshToken({
        userId: user._id
      });

      // Save refresh token to user
      user.refreshToken = refreshToken;
      user.lastLogin = new Date();
      await user.save();

      res.status(201).json({
        message: 'User registered successfully',
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Registration failed',
        details: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user || !user.active) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Verify password
      const isValidPassword = await AuthUtils.comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Generate tokens
      const accessToken = AuthUtils.generateToken({
        userId: user._id,
        role: user.role,
        permissions: AuthUtils.getRolePermissions(user.role)
      });

      const refreshToken = AuthUtils.generateRefreshToken({
        userId: user._id
      });

      // Update user's last login and refresh token
      user.lastLogin = new Date();
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Login failed',
        details: error.message
      });
    }
  }

  static async logout(req, res) {
    try {
      const { userId } = req.user;

      // Clear refresh token
      await User.findByIdAndUpdate(userId, {
        $unset: { refreshToken: 1 }
      });

      res.json({
        message: 'Logout successful'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Logout failed',
        details: error.message
      });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = AuthUtils.verifyRefreshToken(refreshToken);

      // Find user with this refresh token
      const user = await User.findOne({
        _id: decoded.userId,
        refreshToken,
        active: true
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid refresh token'
        });
      }

      // Generate new tokens
      const accessToken = AuthUtils.generateToken({
        userId: user._id,
        role: user.role,
        permissions: AuthUtils.getRolePermissions(user.role)
      });

      const newRefreshToken = AuthUtils.generateRefreshToken({
        userId: user._id
      });

      // Update refresh token in database
      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      res.status(401).json({
        error: 'Token refresh failed',
        details: error.message
      });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      // Generate password reset token
      const resetToken = AuthUtils.generateTempToken({
        userId: user._id
      });

      // Save reset token and expiration
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // In a real application, send email with reset link
      // For demo purposes, just return the token
      res.json({
        message: 'Password reset token generated',
        resetToken
      });
    } catch (error) {
      res.status(500).json({
        error: 'Password reset failed',
        details: error.message
      });
    }
  }
}

module.exports = AuthController;