import * as types from '../../fixtures/types';
import * as shared from '../shared';

export function createRoom(suffix = '', users = []) {
  return {
    name: 'room-' + shared.getRunId() + (suffix ? `-${suffix}` : ''),
    description: 'created during automated testing',
    users: users,
  } as types.RoomData;
}

export function createIdea(suffix = '', setup?: { box?: string; category?: string; comments?: string[] }) {
  return {
    name: 'test-idea-' + shared.getRunId() + (suffix ? `-${suffix}` : ''),
    description: 'generated during testing data',
    box: setup?.box,
    category: setup?.category,
  } as types.IdeaData;
}

export function createBox(suffix = '', room: types.RoomData, ideas = []) {
  return {
    name: 'test-box-' + shared.getRunId() + (suffix ? `-${suffix}` : ''),
    description: 'generated during automated testing',
    ideas: ideas,
    discussionDays: 6,
    votingDays: 10,
    phase: 10,
    room: room,
  } as types.BoxData;
}

export function createUserData(username: string, role = 20) {
  const runId = shared.getRunId();
  return {
    username: `test-${username}-${runId}`,
    password: 'aula',
    displayName: `Test ${username} ${runId}`,
    realName: `${username} ${runId}`,
    role: role,
    about: 'generated in e2e tests',
  } as types.UserData;
}
