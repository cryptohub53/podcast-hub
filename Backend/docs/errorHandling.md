# Error Handling System

## Overview
This backend uses a centralized error handling system with custom error classes and a global error handler middleware.

## Custom Error Classes

### Base Error Class
- `AppError`: Base class for all operational errors
  - Properties: `statusCode`, `status`, `isOperational`
  - Automatically sets `status` based on status code (4xx = 'fail', 5xx = 'error')

### Specific Error Classes
- `ValidationError` (400): For validation failures
- `UnauthorizedError` (401): For authentication failures
- `ForbiddenError` (403): For authorization failures
- `NotFoundError` (404): For resource not found
- `ConflictError` (409): For resource conflicts
- `BadRequestError` (400): For malformed requests
- `TooManyRequestsError` (429): For rate limiting
- `InternalServerError` (500): For server errors
- `DatabaseError` (500): For database operation failures
- `AWSError` (500): For AWS service failures

## Usage in Controllers

### Using catchAsync wrapper
```typescript
import { catchAsync } from "../middlewares/errorMiddleware";
import { NotFoundError } from "../utils/error";

const getUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new NotFoundError("User not found");
  }
  
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});
```

### Manual error throwing
```typescript
// Validation error
if (!email) {
  throw new ValidationError("Email is required");
}

// Authorization error
if (user.role !== 'admin') {
  throw new ForbiddenError("Admin access required");
}

// Database error
try {
  await User.create(userData);
} catch (error) {
  throw new DatabaseError("Failed to create user");
}
```

## Error Response Format

### Development Environment
```json
{
  "status": "error",
  "error": { /* full error object */ },
  "message": "Detailed error message",
  "stack": "Error stack trace"
}
```

### Production Environment
```json
{
  "status": "fail",
  "message": "User-friendly error message"
}
```

## Automatic Error Handling

The global error handler automatically handles:
- MongoDB CastError (Invalid ObjectId)
- MongoDB Duplicate Key Error
- MongoDB Validation Error
- JWT Token Errors
- Unhandled Promise Rejections

## Best Practices

1. Always use `catchAsync` wrapper for async route handlers
2. Throw specific error types instead of generic errors
3. Provide meaningful error messages
4. Use operational errors for expected failures
5. Log programming errors but don't expose details to clients
