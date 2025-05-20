import { expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import * as shared from '../../shared';
import * as users from '../../fixtures/users';
import { sleep } from '../../utils';

const host = shared.getHost();

const runId = fs.readFileSync('run-id.txt', 'utf-8');
console.log('Run ID:', runId);

export const create = async (page: Page, roomName: string, users: users.UserData[]) => {
  // start at home
  await page.goto(host);

  await page.locator('a[href="/settings/rooms"]').click();

  await page.getByRole('button', { name: 'Raum hinzufügen' }).click();

  // fill in the necessary information
  await page.fill('input[name="room_name"]', 'room-' + roomName + '-' + runId);
  await page.locator('div[contenteditable="true"]').fill('generated during automated tests');

  await page.locator('input[role="combobox"]').click();

  await page.getByRole('option', { name: users[0].displayName }).click();
  await page.locator('input[role="combobox"]').click();

  await page.getByRole('option', { name: users[1].displayName }).click();
  await page.locator('input[role="combobox"]').click();

  await page.getByRole('option', { name: users[2].displayName }).click();

  await page.locator('button[type="submit"]').click();
};
