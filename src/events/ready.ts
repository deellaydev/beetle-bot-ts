import { Event } from '../structures/Event';
import { openConnection } from '../db';

export default new Event('ready', () => {
  console.log('Bot is online');
  openConnection().then(() => 'DB is connected');
});
