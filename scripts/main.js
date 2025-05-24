import { rejestrujUstawienia } from "./ustawienia.js";
import { dodajPrzyciskiDoSidebaru } from "./przyciskiWidocznosc.js";


Hooks.once("init", () => {
  rejestrujUstawienia();
});

Hooks.on("renderActorDirectory", (app, html) => dodajPrzyciskiDoSidebaru(html[0] ?? html, "actor"));
Hooks.on("renderItemDirectory", (app, html) => dodajPrzyciskiDoSidebaru(html[0] ?? html, "item"));
Hooks.on("renderJournalDirectory", (app, html) => dodajPrzyciskiDoSidebaru(html[0] ?? html, "journal"));
Hooks.on("renderMacroDirectory", (app, html) => dodajPrzyciskiDoSidebaru(html[0] ?? html, "macro"));
Hooks.on("renderRollTableDirectory", (app, html) => dodajPrzyciskiDoSidebaru(html[0] ?? html, "rolltable"));


Hooks.on("refreshSidebarButtons", () => {
  setTimeout(() => {
    for (const dir of [ui.actors, ui.items, ui.journal, ui.macros, ui.tables]) {
      dir?.render?.(true);
    }
  }, 10);
});