import NoteGesture from "./NoteGesture.js";
import NoteFormGesture from "./FormGesture.js";
import NoteCloneGesture from "./NoteCloneGesture.js";
import SideBar from "./SideBar.js";
import Menu from "./Menu.js";
import RemoveNote from "./Garbage.js";
import AnnounceController from "./Announce.js";
import SelectedNotesNavbar, {
  removeNotesNavbar,
} from "./SelectedNotesNavbar.js";

$(document).ready(function () {
  NoteGesture();
  NoteFormGesture();
  Menu();
  NoteCloneGesture();
  SideBar();
  RemoveNote();
  AnnounceController();
  SelectedNotesNavbar();
  removeNotesNavbar();
});
