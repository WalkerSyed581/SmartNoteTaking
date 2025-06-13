// Example: Database Integration Test
describe('Database Operations', () => {
    test('retrieves user notes with proper filtering', async () => {
      const user = await User.create({
        username: 'dbtest',
        email: 'dbtest@example.com',
        password: 'password'
      });
  
      await Note.create([
        { title: 'Note 1', content: 'Content 1', userId: user._id },
        { title: 'Note 2', content: 'Content 2', userId: user._id, isArchived: true }
      ]);
  
      const activeNotes = await Note.find({ userId: user._id, isArchived: false });
      const archivedNotes = await Note.find({ userId: user._id, isArchived: true });
  
      expect(activeNotes.length).toBe(1);
      expect(archivedNotes.length).toBe(1);
    });
  });
  