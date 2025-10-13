// Storage interface for server-side operations
// This app uses local storage on the frontend, so this is just a placeholder

export interface IStorage {
  // Server storage not used in this application
  // All data is stored client-side in localStorage
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
