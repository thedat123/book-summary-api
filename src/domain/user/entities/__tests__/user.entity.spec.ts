import { User } from '../user.entity';

describe('User entity', () => {
  describe('hasEmail()', () => {
    it('returns true when email matches', () => {
      const user = new User('u-1', 'alice@example.com', 'Alice', new Date());
      expect(user.hasEmail('alice@example.com')).toBe(true);
    });

    it('returns false for a different email', () => {
      const user = new User('u-1', 'alice@example.com', 'Alice', new Date());
      expect(user.hasEmail('bob@example.com')).toBe(false);
    });
  });

  describe('displayName()', () => {
    it('returns name when it is set', () => {
      const user = new User('u-1', 'alice@example.com', 'Alice Wonderland', new Date());
      expect(user.displayName()).toBe('Alice Wonderland');
    });

    it('returns the email username when name is null', () => {
      const user = new User('u-1', 'alice@example.com', null, new Date());
      expect(user.displayName()).toBe('alice');
    });

    it('uses the part before @ for email-derived display name', () => {
      const user = new User('u-1', 'john.doe+test@company.org', null, new Date());
      expect(user.displayName()).toBe('john.doe+test');
    });
  });
});
