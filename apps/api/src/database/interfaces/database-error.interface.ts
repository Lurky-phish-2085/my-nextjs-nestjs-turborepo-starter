import PostgresError from '../enums/postgres-error.enum';

interface DatabaseError extends Error {
  code: PostgresError;
}

export default DatabaseError;
