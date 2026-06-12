import { User } from '../entities/user.entity';

/**
 * IUserRepository — Domain Repository Interface
 *
 * Mirrors the `users` table (no FK dependencies — users is a root table).
 *
 * Responsibility: Persist and retrieve User entities.
 *   Authentication (password verification, token issuance) is handled by
 *   an external service and is NOT part of this interface.
 */
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, partial: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;
  existsByEmail(email: string): Promise<boolean>;
}

export interface UpdateUserData {
  name?: string;
}
