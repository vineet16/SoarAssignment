const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

class AuthUtils {
  /**
   * Generate JWT token
   * @param {Object} payload - Data to be encoded in the token
   * @param {string} expiresIn - Token expiration time (default: '24h')
   * @returns {string} JWT token
   */
  static generateToken(payload, expiresIn = '24h') {
    return jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn }
    );
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Hash password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} True if password matches
   */
  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate refresh token
   * @param {Object} payload - Data to be encoded in the token
   * @returns {string} Refresh token
   */
  static generateRefreshToken(payload, expiresIn = '7d') {
    return jwt.sign(
      payload,
      config.refreshTokenSecret,
      { expiresIn }
    );
  }

  /**
   * Verify refresh token
   * @param {string} token - Refresh token to verify
   * @returns {Object} Decoded token payload
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, config.refreshTokenSecret);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Generate temporary access token (for password reset, email verification, etc.)
   * @param {Object} payload - Data to be encoded in the token
   * @param {string} expiresIn - Token expiration time (default: '1h')
   * @returns {string} Temporary access token
   */
  static generateTempToken(payload, expiresIn = '1h') {
    return jwt.sign(
      payload,
      config.tempTokenSecret,
      { expiresIn }
    );
  }

  /**
   * Generate random token (for API keys, etc.)
   * @param {number} length - Length of the token
   * @returns {string} Random token
   */
  static generateRandomToken(length = 32) {
    return require('crypto').randomBytes(length).toString('hex');
  }

  /**
   * Extract token from request header
   * @param {Object} req - Express request object
   * @returns {string|null} Token or null if not found
   */
  static extractTokenFromHeader(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }

  /**
   * Get user permissions based on role
   * @param {string} role - User role
   * @returns {string[]} Array of permissions
   */
  static getRolePermissions(role) {
    const permissions = {
      superadmin: [
        'manage:all',
        'read:all',
        'write:all',
        'delete:all'
      ],
      school_admin: [
        'manage:school',
        'read:school',
        'write:school',
        'delete:school'
      ],
      teacher: [
        'read:classroom',
        'write:classroom'
      ],
      student: [
        'read:profile',
        'read:classroom'
      ]
    };

    return permissions[role] || [];
  }
}

module.exports = AuthUtils;