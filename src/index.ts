import joplin from "api";
import { SettingItemType, ToolbarButtonLocation } from "api/types";

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
