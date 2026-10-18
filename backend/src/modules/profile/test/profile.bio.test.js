// profile.bio.test.js
// FR-PROF-03 (profile bio, 7.1) — the 300-character cap is enforced on the server, only a
// job-seeker has this bio, and an empty value clears it. Prisma mocked.
import { jest } from '@jest/globals';

const prismaMock = { user: { update: jest.fn() } };
jest.unstable_mockModule('../../../lib/prisma.js', () => ({ default: prismaMock }));

const { updateBio, BIO_MAX_LENGTH } = await import('../profile.bio.js');

const youth = { id: 'y1', role: 'YOUTH_JOB_SEEKER' };

beforeEach(() => {
  jest.resetAllMocks();
  prismaMock.user.update.mockImplementation(({ data }) => Promise.resolve({ bio: data.bio }));
});

describe('FR-PROF-03: updateBio', () => {
  test('saves a bio of exactly 300 characters', async () => {
    const bio = 'a'.repeat(BIO_MAX_LENGTH);
    await expect(updateBio({ user: youth, bio })).resolves.toEqual({ bio });
  });

  test('refuses 301 characters with a field error, writing nothing', async () => {
    await expect(updateBio({ user: youth, bio: 'a'.repeat(301) })).rejects.toMatchObject({
      status: 400,
      fields: { bio: 'Your bio can be up to 300 characters.' },
    });
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  test('trims, and an empty bio clears it', async () => {
    await updateBio({ user: youth, bio: '   ' });
    expect(prismaMock.user.update.mock.calls[0][0].data).toEqual({ bio: null });
  });

  test('an employer or verifier is refused (their description is the business bio)', async () => {
    await expect(updateBio({ user: { id: 'e', role: 'EMPLOYER' }, bio: 'x' })).rejects.toMatchObject({ status: 403 });
  });

  test('a non-string is refused', async () => {
    await expect(updateBio({ user: youth, bio: 42 })).rejects.toMatchObject({ status: 400 });
  });
});
