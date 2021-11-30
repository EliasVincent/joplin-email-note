import joplin from "api";
import {
  MenuItemLocation,
  SettingItemType,
  ToolbarButtonLocation,
} from "api/types";
const showdown = require("showdown");

joplin.plugins.register({
  onStart: async function () {
    // create setting to toggle html email
    await joplin.settings.registerSection("emailNote", {
      label: "Email Note",
      iconName: "far fa-envelope",
    });
    await joplin.settings.registerSettings({
      toggleHtml: {
        type: SettingItemType.Bool,
        value: false,
        description:
          "You might have to enable HTML formatting in your email client first.",
        section: "emailNote",
        public: true,
        label: "Convert to HTML",
      },
    });

    //get current note
    async function getCurrentNote() {
      const note = await joplin.workspace.selectedNote();

      if (note) {
        return note;
      } else {
        console.info("no note selected");
      }
    }

    await joplin.workspace.onNoteChange(() => {
      getCurrentNote();
    });
    await joplin.workspace.onNoteSelectionChange(() => {
      getCurrentNote();
    });
    getCurrentNote();

    await joplin.commands.register({
      name: "openEmail",
      label: "Email Note",
      iconName: "far fa-envelope",
      execute: async () => {
        const currNote = await getCurrentNote();
        if (currNote) {
          const toggleHtml = await joplin.settings.value("toggleHtml");
          openEmail(currNote.title, currNote.body, toggleHtml);
        } else {
          console.info("error with execute command");
        }
      },
    });

    await joplin.views.toolbarButtons.create(
      "email-button",
      "openEmail",
      ToolbarButtonLocation.EditorToolbar
    );

    await joplin.commands.register({
      name: "emailSelection",
      label: "Email Selection",
      execute: async () => {
        const currNote = await getCurrentNote();
        // get selected text
        const selectedText = (await joplin.commands.execute(
          "selectedText"
        )) as string;
        if (selectedText) {
          const toggleHtml = await joplin.settings.value("toggleHtml");
          openEmail(currNote.title, selectedText, toggleHtml);
        } else {
          console.info("error with execute emailSelection command");
        }
      },
    });

    // create context menu item to email selection
    await joplin.views.menuItems.create(
      "emailSelectionThroughContextMenu",
      "emailSelection",
      MenuItemLocation.EditorContextMenu,
      { accelerator: "Ctrl+Alt+E" }
    );
  },
});

function filterHeadings(content) {
  const regex = /^(#{1,6} )/gm;
  const filteredContent = content.replace(regex, "");
  return filteredContent;
}

function convertToHTML(content) {
  const converter = new showdown.Converter();

  // some options for the converter to be in line with Joplin's Markdown
  converter.setOption("tables", true);
  converter.setOption("tasklists", true);
  converter.setOption("requireSpaceBeforeHeadingText", true)
  converter.setOption("strikethrough", true);
  converter.setOption("simpleLineBreaks", true);

  const html = converter.makeHtml(content);
  return html;
}

function openEmail(title, content, html: Boolean) {
  const filteredContent = html
    ? convertToHTML(content)
    : filterHeadings(content);
  const mailto_link =
    "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(filteredContent);
  window.location.href = mailto_link;
}
