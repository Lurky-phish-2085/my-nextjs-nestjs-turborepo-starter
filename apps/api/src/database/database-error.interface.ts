import PostgresError from './postgres-error.enum';

interface DatabaseError extends Error {
  code: PostgresError;
}

export default DatabaseError;
