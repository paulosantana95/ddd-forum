import { UseCaseError } from "@/core/errors/use-cas-error"

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not allowed')
  }
}
