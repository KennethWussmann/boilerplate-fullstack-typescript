export const toError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      cause: error.cause,
      stack: error.stack?.split('\n')?.map((line) => line.trimStart()),
    };
  } else {
    throw new Error('Failed to convert error');
  }
};
