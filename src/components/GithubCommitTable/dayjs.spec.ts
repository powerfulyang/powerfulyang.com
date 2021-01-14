import dayjs from 'dayjs';

const LocalizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(LocalizedFormat);

describe('dayjs', function () {
  it('判断今天周几 dayjs#day', function () {
    const day = dayjs().day();
    expect(day).toBeDefined();
  });

  it('dayjs#format MMMM D, YYYY January 14, 2021', function () {
    const day = dayjs().format('LL');
    expect(day).toBeDefined();
  });

  it('dayjs#subtract', function () {
    const day1 = dayjs().subtract(1, 'day').format('LL');
    expect(day1).toBeDefined();
  });
});
