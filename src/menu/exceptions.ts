export class MenuValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuValidationError';
  }
}

export class MenuRenderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuRenderError';
  }
}

export class MenuInteractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MenuInteractionError';
  }
}
