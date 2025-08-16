const UserModel = require('../models/userModel');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { verifyFirebaseToken } = require('../services/firebaseAdmin');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');

// Register new user
const register = asyncHandler(async (req, res) => {
  const { email, password, full_name, gender, mobile_number, signup_type } = req.body;

  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Check if mobile number exists
  const existingMobile = await UserModel.findByMobile(mobile_number);
  if (existingMobile) {
    throw new AppError('User with this mobile number already exists', 409);
  }

  // Create new user
  const user = await UserModel.create({
    email,
    password,
    full_name,
    gender,
    mobile_number,
    signup_type
  });

  // Generate tokens
  const token = generateToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        gender: user.gender,
        mobile_number: user.mobile_number,
        signup_type: user.signup_type,
        is_email_verified: user.is_email_verified,
        is_mobile_verified: user.is_mobile_verified,
        created_at: user.created_at
      },
      token,
      refreshToken
    }
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await UserModel.verifyPassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const token = generateToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        gender: user.gender,
        mobile_number: user.mobile_number,
        signup_type: user.signup_type,
        is_email_verified: user.is_email_verified,
        is_mobile_verified: user.is_mobile_verified,
        created_at: user.created_at
      },
      token,
      refreshToken
    }
  });
});

// Firebase login
const firebaseLogin = asyncHandler(async (req, res) => {
  const { firebase_token } = req.body;

  if (!firebase_token) {
    throw new AppError('Firebase token is required', 400);
  }

  // Verify Firebase token
  const decodedToken = await verifyFirebaseToken(firebase_token);
  const { email, name, uid } = decodedToken;

  if (!email) {
    throw new AppError('Email not found in Firebase token', 400);
  }

  // Check if user exists
  let user = await UserModel.findByEmail(email);

  if (!user) {
    // Create new user from Firebase data
    user = await UserModel.create({
      email,
      password: uid, // Use Firebase UID as password placeholder
      full_name: name || 'Firebase User',
      gender: 'other',
      mobile_number: decodedToken.phone_number || '+0000000000',
      signup_type: 'g'
    });

    // Mark email as verified since it's from Firebase
    await UserModel.verifyEmail(user.id);
  }

  // Generate tokens
  const token = generateToken({ userId: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ userId: user.id });

  res.json({
    success: true,
    message: 'Firebase login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        gender: user.gender,
        mobile_number: user.mobile_number,
        signup_type: user.signup_type,
        is_email_verified: user.is_email_verified,
        is_mobile_verified: user.is_mobile_verified,
        created_at: user.created_at
      },
      token,
      refreshToken
    }
  });
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: {
      user
    }
  });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { email, full_name, gender, mobile_number } = req.body;

  // Check if email is being changed and if it already exists
  if (email && email !== req.user.email) {
    const emailExists = await UserModel.emailExists(email, userId);
    if (emailExists) {
      throw new AppError('Email already exists', 409);
    }
  }

  // Check if mobile is being changed and if it already exists
  if (mobile_number) {
    const mobileExists = await UserModel.mobileExists(mobile_number, userId);
    if (mobileExists) {
      throw new AppError('Mobile number already exists', 409);
    }
  }

  const updateData = {};
  if (email) updateData.email = email;
  if (full_name) updateData.full_name = full_name;
  if (gender) updateData.gender = gender;
  if (mobile_number) updateData.mobile_number = mobile_number;

  // If email is changed, mark as unverified
  if (email && email !== req.user.email) {
    updateData.is_email_verified = false;
  }

  // If mobile is changed, mark as unverified
  if (mobile_number) {
    updateData.is_mobile_verified = false;
  }

  const updatedUser = await UserModel.update(userId, updateData);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  const userId = req.user.id;

  // Validate request
  if (!current_password || !new_password) {
    throw new AppError('Current password and new password are required', 400);
  }

  if (new_password.length < 8) {
    throw new AppError('New password must be at least 8 characters long', 400);
  }

  // Get user with password hash
  const user = await UserModel.findByEmail(req.user.email);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await UserModel.verifyPassword(current_password, user.password_hash);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  await UserModel.updatePassword(userId, new_password);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const user = await UserModel.verifyEmail(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'Email verified successfully',
    data: {
      user
    }
  });
});

// Verify mobile
const verifyMobile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const user = await UserModel.verifyMobile(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    message: 'Mobile number verified successfully',
    data: {
      user
    }
  });
});

// Refresh token
const refreshToken = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const decoded = verifyToken(refresh_token);
    
    // Verify user still exists
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate new tokens
    const newToken = generateToken({ userId: user.id, email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
});

// Logout (client-side token removal)
const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = {
  register,
  login,
  firebaseLogin,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  verifyMobile,
  refreshToken,
  logout
};