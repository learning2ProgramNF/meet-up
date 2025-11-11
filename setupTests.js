import '@testing-library/jest-dom';

// Mock NProgress for tests
global.NProgress = {
  start: jest.fn(),
  done: jest.fn(),
  set: jest.fn(),
  inc: jest.fn(),
  configure: jest.fn(),
  remove: jest.fn(),
};

const MESSAGES_TO_IGNORE = [
  'When testing, code that causes React state updates should be wrapped into act(...):',
  'Error:',
  'The above error occurred',
];

const originalError = console.error.bind(console.error);

console.error = (...args) => {
  const ignoreMessage = MESSAGES_TO_IGNORE.find((message) =>
    args.toString().includes(message)
  );
  if (!ignoreMessage) originalError(...args);
};

jest.setTimeout(60000);
