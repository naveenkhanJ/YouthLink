// gigPosting.reconfirm.test.js
// FR-POST-11 criterion 2 / FR-ENG-09 — the re-confirmation request a material edit creates after a
// place is filled. Pure helpers and a mocked transaction client; no database.
import { jest } from '@jest/globals';
import { reconfirmDeadline, requestReconfirmation } from '../posting.reconfirm.js';

const HOUR = 3600e3;

describe('reconfirmDeadline: the shorter of 48 hours and half the time left', () => {
  const now = new Date('2026-08-27T19:00:00Z'); // Thursday 7 PM

  test('36 hours to the start gives an 18 hour window', () => {
    const start = new Date(now.getTime() + 36 * HOUR);
    expect(reconfirmDeadline(start, now)).toEqual(new Date(now.getTime() + 18 * HOUR));
  });

  test('100 hours to the start is capped at 48 hours', () => {
    const start = new Date(now.getTime() + 100 * HOUR);
    expect(reconfirmDeadline(start, now)).toEqual(new Date(now.getTime() + 48 * HOUR));
  });

  test('a start already past gives no window rather than a negative one', () => {
    const start = new Date(now.getTime() - HOUR);
    expect(reconfirmDeadline(start, now)).toEqual(now);
  });
});

describe('requestReconfirmation', () => {
  const posting = { id: 'p1', payAmount: 6000, workersNeeded: 3 };
  const newStartAt = new Date(Date.now() + 5 * 24 * HOUR);

  function txWith(engagements) {
    return {
      engagement: { findMany: jest.fn().mockResolvedValue(engagements) },
      materialChangeRequest: { create: jest.fn() },
    };
  }

  test('creates one PENDING request per active engagement and returns how many', async () => {
    const tx = txWith([{ id: 'e1' }, { id: 'e2' }]);
    const count = await requestReconfirmation({ posting, changes: { payAmount: 7000 }, newStartAt }, tx);

    expect(count).toBe(2);
    expect(tx.engagement.findMany.mock.calls[0][0].where).toEqual({
      gigPostingId: 'p1',
      status: { not: 'CANCELLED' },
    });
    expect(tx.materialChangeRequest.create).toHaveBeenCalledTimes(2);
    expect(tx.materialChangeRequest.create.mock.calls[1][0].data).toMatchObject({
      gigPostingId: 'p1',
      engagementId: 'e2',
      status: 'PENDING',
    });
  });

  test('records the old and new value of each changed field', async () => {
    const tx = txWith([{ id: 'e1' }]);
    await requestReconfirmation({ posting, changes: { payAmount: 7000, workersNeeded: 1 }, newStartAt }, tx);

    expect(tx.materialChangeRequest.create.mock.calls[0][0].data.changeSummary).toEqual({
      payAmount: { from: 6000, to: 7000 },
      workersNeeded: { from: 3, to: 1 },
    });
  });

  test('creates nothing when no one is engaged', async () => {
    const tx = txWith([]);
    await expect(requestReconfirmation({ posting, changes: { payAmount: 7000 }, newStartAt }, tx)).resolves.toBe(0);
    expect(tx.materialChangeRequest.create).not.toHaveBeenCalled();
  });
});
