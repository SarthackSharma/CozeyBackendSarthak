import {
  formatDate,
  formatDateForInput,
  isValidDate,
  addDays,
  getDateRange,
  formatDateTime
} from '../dateFormatter';

describe('Date Formatter', () => {
  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-03-15');
      expect(formatDate(date)).toBe('15 Mar 2024');
    });

    it('should handle single digit days and months', () => {
      const date = new Date('2024-05-07');
      expect(formatDate(date)).toBe('07 May 2024');
    });

    it('should handle invalid dates', () => {
      expect(formatDate('invalid')).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('should handle ISO string dates', () => {
      expect(formatDate('2024-03-15')).toBe('15 Mar 2024');
    });
  });

  describe('formatDateTime', () => {
    beforeAll(() => {
      // Mock timezone to UTC for consistent tests
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should format datetime correctly', () => {
      const date = new Date('2024-03-15T14:30:00');
      expect(formatDateTime(date)).toBe('15 Mar 2024, 14:30');
    });

    it('should handle single digit hours and minutes', () => {
      const date = new Date('2024-03-15T09:05:00');
      expect(formatDateTime(date)).toBe('15 Mar 2024, 09:05');
    });

    it('should handle midnight and noon', () => {
      const midnight = new Date('2024-03-15T00:00:00');
      const noon = new Date('2024-03-15T12:00:00');
      expect(formatDateTime(midnight)).toBe('15 Mar 2024, 00:00');
      expect(formatDateTime(noon)).toBe('15 Mar 2024, 12:00');
    });

    it('should handle invalid datetime', () => {
      expect(formatDateTime('invalid')).toBe('');
      expect(formatDateTime('')).toBe('');
    });
  });

  describe('formatDateForInput', () => {
    it('should format date for HTML input', () => {
      const date = new Date('2024-03-15');
      expect(formatDateForInput(date)).toBe('2024-03-15');
    });
  });

  describe('isValidDate', () => {
    it('should validate dates correctly', () => {
      expect(isValidDate('2024-03-15')).toBe(true);
      expect(isValidDate('invalid')).toBe(false);
      expect(isValidDate('')).toBe(false);
      expect(isValidDate(new Date())).toBe(true);
    });

    it('should handle different date formats', () => {
      expect(isValidDate('2024-03-15')).toBe(true);
      expect(isValidDate('2024/03/15')).toBe(true);
      expect(isValidDate('15-03-2024')).toBe(true);
      expect(isValidDate('March 15, 2024')).toBe(true);
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date('2024-03-15');
      const result = addDays(date, 5);
      expect(result).toEqual(new Date('2024-03-20'));
    });
  });

  describe('getDateRange', () => {
    it('should return array of dates between start and end', () => {
      const start = new Date('2024-03-15');
      const end = new Date('2024-03-17');
      const range = getDateRange(start, end);
      expect(range).toHaveLength(3);
      expect(range[0]).toEqual(new Date('2024-03-15'));
      expect(range[1]).toEqual(new Date('2024-03-16'));
      expect(range[2]).toEqual(new Date('2024-03-17'));
    });
  });
}); 