import z, { ZodError, ZodSchema } from "zod";
import { HttpUnprocessableEntityException } from "./HttpUnprocessableEntityException";
import { HttpInternalServerException } from "./HttpInternalServerException";
import { ErrorDetails } from "./BaseException";

export function SchemaSafeParse<T> (schema: ZodSchema<T>, data: T) {
  try {
    schema.parse(data);
  } catch (error) {
    if(error instanceof ZodError) {
      const details: ErrorDetails[] = error.issues.map((zodErr, idx) => {
        return { field: zodErr.path[idx], message: zodErr.message }
      })
      throw new HttpUnprocessableEntityException(details);
    }
    throw new HttpInternalServerException('An error has occurred while try to safe parse.');
  }
}