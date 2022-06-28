export function FinalValidationError(message: string) {
  this.message = message;
  this.type = "final";
}
