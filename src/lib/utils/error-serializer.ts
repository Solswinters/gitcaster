/**
 * Serialize errors for logging and transmission
 */

export interface SerializedError {
  message: string;
  name?: string;
  stack?: string;
  code?: string | number;
  cause?: SerializedError;
  metadata?: Record<string, unknown>;
}

/**
 * Serialize an error to a plain object
 */
export function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    const serialized: SerializedError = {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };

    // Add additional properties
    const err = error as any;
    if (err.code) serialized.code = err.code;
    if (err.cause) serialized.cause = serializeError(err.cause);

    return serialized;
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  if (typeof error === 'object' && error !== null) {
    const obj = error as any;
    return {
      message: obj.message || String(error),
      name: obj.name,
      code: obj.code || obj.statusCode,
      metadata: obj,
    };
  }

  return { message: String(error) };
}

/**
 * Deserialize error from plain object
 */
export function deserializeError(serialized: SerializedError): Error {
  const error = new Error(serialized.message);
  if (serialized.name) error.name = serialized.name;
  if (serialized.stack) error.stack = serialized.stack;
  if (serialized.code) (error as any).code = serialized.code;
  return error;
}

