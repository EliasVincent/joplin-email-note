import joplin from "api";
import { MenuItemLocation, ToolbarButtonLocation } from "api/types";

joplin.plugins.register({
  onStart: async function () {
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
          openEmail(currNote.title, currNote.body);
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
        const selectedText = await joplin.commands.execute(
          "selectedText"
        ) as string;
        if (selectedText) {
          openEmail(currNote.title, selectedText);
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

function openEmail(title, content) {
  const filteredContent = filterHeadings(content);

  const mailto_link =
    "mailto:?subject=" + title + "&body=" + encodeURIComponent(filteredContent);
  window.location.href = mailto_link;
}
