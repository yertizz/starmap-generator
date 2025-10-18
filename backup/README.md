# Star Map Project Backup System

This backup system helps you maintain version history of your Star Map project files.

## How It Works

The backup system creates timestamped snapshots of your project files before making changes. This ensures you can always go back to a previous working version if something goes wrong.

## Files

- `backup.js` - The main backup script that creates timestamped backups
- `create-backup.bat` - A Windows batch file to easily run the backup script
- `versions/` - Directory containing all the backups, organized by timestamp

## How to Use

### Creating a Backup

Before making changes to your project, run:

```
backup/create-backup.bat "Description of your changes"
```

For example:
```
backup/create-backup.bat "Fixed map location issues"
```

### Restoring from a Backup

To restore from a backup:

1. Go to the `backup/versions` directory
2. Find the timestamp folder you want to restore from
3. Copy the files from that folder back to your project root

## Best Practices

- Always create a backup before making significant changes
- Include a descriptive message with each backup
- Keep your backups organized by using meaningful descriptions

## Automatic Backups

You can also integrate this backup system into your workflow by running the backup script before any file modifications.
