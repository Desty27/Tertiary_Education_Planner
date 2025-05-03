const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin'],
      default: 'student'
    },
    profileImage: {
      type: String,
      default: ''
    },
    organization: {
      type: String,
      trim: true
    },
    position: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      notifications: {
        email: {
          type: Boolean,
          default: true
        },
        push: {
          type: Boolean,
          default: true
        }
      },
      accessibility: {
        fontSize: {
          type: String,
          enum: ['small', 'medium', 'large'],
          default: 'medium'
        },
        highContrast: {
          type: Boolean,
          default: false
        }
      }
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Update lastLogin on save if not a new user
  if (!this.isNew) {
    this.lastLogin = Date.now();
  }
  next();
});

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Instance method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = Date.now();
  return this.save();
};

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;