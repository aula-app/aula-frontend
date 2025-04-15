import fs from 'fs';

// note, playwright runs each test in different threads, therefore
// these values can't be relied upon being the same.
// rely on setRunId during setup, then getRunId during tests.
export const now = new Date();
export const timestring = now.toISOString();
export const timestamp = now.getTime().toString();

export const getHost = () => `http://localhost:3000`;

export const getRunId = () => fs.readFileSync('run-id.txt', 'utf-8');

export const setRunId = () => fs.writeFileSync('run-id.txt', 'run-id-' + timestamp);
