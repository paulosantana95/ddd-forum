import { UseCaseError } from "@/core/errors/use-cas-error"

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource not found.')
  }
}
