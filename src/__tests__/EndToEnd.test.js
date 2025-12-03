import puppeteer from 'puppeteer';

describe('show/hide an event details', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 60000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForSelector('.event', { timeout: 30000 });
  });

  afterEach(async () => {
    await page.close();
  });

  test('An event element is collapsed by default', async () => {
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see details', async () => {
    await page.click('.event .details-btn');
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeDefined();
  });

  test('User can collapse an event to hide details', async () => {
    // First, expand the event
    await page.click('.event .details-btn');
    let eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeDefined();

    // Then, collapse it
    await page.click('.event .details-btn');
    eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });
});

// FEATURE 1: Filter Events by City
describe('filter events by city', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 60000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForSelector('.event', { timeout: 30000 });
  });

  afterEach(async () => {
    await page.close();
  });

  // SCENARIO 1
  test("When user hasn't searched for a city, show upcoming events from all cities", async () => {
    const eventCount = await page.$$eval('.event', (events) => events.length);
    expect(eventCount).toBeGreaterThan(0);
  });

  // SCENARIO 2
  test('User should see a list of suggestions when they search for a city', async () => {
    await page.click('#city-search input');
    await page.type('#city-search input', 'Berlin');

    await page.waitForSelector('#city-search .suggestions li', {
      timeout: 5000,
    });

    const suggestionCount = await page.$$eval(
      '#city-search .suggestions li',
      (items) => items.length
    );
    expect(suggestionCount).toBeGreaterThan(0);
  });

  // SCENARIO 3
  test('User can select a city from the suggested list', async () => {
    await page.click('#city-search input');
    await page.type('#city-search input', 'Berlin');

    await page.waitForSelector('#city-search .suggestions li', {
      timeout: 5000,
    });

    await page.click('#city-search .suggestions li:first-child');

    const inputValue = await page.$eval(
      '#city-search input',
      (input) => input.value
    );
    expect(inputValue).toContain('Berlin');
  });
});
