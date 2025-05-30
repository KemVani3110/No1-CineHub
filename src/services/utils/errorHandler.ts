export class ServiceError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}

export function handleServiceError(error: unknown) {
  if (error instanceof ServiceError) {
    return {
      status: error.status,
      message: error.message,
      code: error.code,
    };
  }
  return {
    status: 500,
    message: 'Internal server error',
    code: 'SERVER_ERROR',
  };
}
