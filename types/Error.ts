export type Error = {
  response?: {
    data?: ErrorMessage;
  };
};

export type ErrorMessage = string | undefined;
