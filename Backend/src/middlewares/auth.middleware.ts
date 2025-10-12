import { getSession } from "@auth/express"
import { authConfig } from "../controllers/auth.js";
import { User } from "../models/index.js";
import { UserRole } from "../utils/constants.js";
import { ForbiddenError, UnauthorizedError } from "../utils/error.js";
import type { NextFunction, Request, Response } from "express"

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        name: string;
      };
    }
  }
}

/**
 * Middleware to check if user is authenticated
 * Sets session in res.locals and user data in req.user
 */
export async function authenticatedUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = res.locals.session ?? (await getSession(req, authConfig)) ?? undefined;

    res.locals.session = session;

    if (!session?.user?.email) {
      throw new UnauthorizedError("Authentication required");
    }

    // Fetch user data from database to get current role and info
    const user = await User.findOne({ email: session.user.email }).select('name email role');

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    // Attach user data to request for use in controllers
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    };

    return next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({
        status: 'error',
        message: error.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: "Authentication error"
    });
  }
}

/**
 * Middleware to set current session without requiring authentication
 * Used for optional authentication routes
 */
export async function currentSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = (await getSession(req, authConfig)) ?? undefined;
    res.locals.session = session;

    // Optionally set user data if session exists
    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email }).select('name email role');
      if (user) {
        req.user = {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name
        };
      }
    }

    return next();
  } catch (error) {
    // Don't fail on optional auth, just continue without user data
    return next();
  }
}

/**
 * Middleware to check if authenticated user has admin role
 * Must be used after authenticatedUser middleware
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: "Authentication required"
    });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({
      status: 'error',
      message: "Admin access required"
    });
  }

  return next();
}

/**
 * Higher-order function to create role-based middleware
 * @param allowedRoles - Array of roles that can access the route
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }

    return next();
  };
}

/**
 * Middleware to check if user owns the resource or is admin
 * Expects userId in request params or body
 */
export function requireOwnershipOrAdmin(userIdField: 'params' | 'body' = 'params') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: "Authentication required"
      });
    }

    const resourceUserId = userIdField === 'params' ? req.params.userId : req.body.userId;

    // Admin can access any resource
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // User can only access their own resources
    if (req.user.id !== resourceUserId) {
      return res.status(403).json({
        status: 'error',
        message: "Access denied. You can only access your own resources"
      });
    }

    return next();
  };
}