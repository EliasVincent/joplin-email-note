# Joplin-Email-Note

A very simple Joplin Plugin to send your current note as an email to your browser or email client of choice. ✉

A quick overview:
- Click the mail icon in the Joplin toolbar to send an email
- The note title will be the subject, the note content will be the body of the email
- Works via the command palette too
- Filters the # from the headings from your note
    - Only works with correctly spaced `# something` headings
- There's also an option to convert to HTML instead
- Right click selected text to only send the selection

Feel free to tell me your suggestions on how to improve it! 😄

## Credits / Resources

[joplin-plugin-create-note-from-text](https://github.com/ambrt/joplin-plugin-create-note-from-text)
[joplin API](https://joplinapp.org/api/overview/)

---

Original Joplin Plugin Readme:

## Joplin Plugin

This is a template to create a new Joplin plugin.

The main two files you will want to look at are:

- `/src/index.ts`, which contains the entry point for the plugin source code.
- `/src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.

## Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

## Updating the plugin framework

To update the plugin framework, run `npm run update`.

In general this command tries to do the right thing - in particular it's going to merge the changes in package.json and .gitignore instead of overwriting. It will also leave "/src" as well as README.md untouched.

The file that may cause problem is "webpack.config.js" because it's going to be overwritten. For that reason, if you want to change it, consider creating a separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.
