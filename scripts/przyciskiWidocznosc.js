import { grafikaTy } from "./przycisk_grafikaTy.js";
import { grafikaWszyscy } from "./przycisk_grafikaWszyscy.js";
import { uprawnienia } from "./przycisk_uprawnienia.js";
import { uzyjMakra } from "./przycisk_uzyjMakra.js";
import { rzuc } from "./przycisk_rzuc.js";

export function dodajPrzyciskiDoSidebaru(html, typ) {
  const elementy = html.querySelectorAll(".directory-item.document");
  const ustawienia = game.settings.get("show-actor-art", "przyciski");

  elementy.forEach(element => {
    if (typ === "actor") {
      dodajJesliIstnieje(element, ustawienia.grafikaTy.aktorzy, grafikaTy);
      dodajJesliIstnieje(element, ustawienia.grafikaWszyscy.aktorzy, grafikaWszyscy);
      if (game.user.isGM && ustawienia.uprawnienia.aktorzy?.gm) dodajJesliIstnieje(element, true, uprawnienia);
    }

    if (typ === "item") {
      dodajJesliIstnieje(element, ustawienia.grafikaTy.przedmioty, grafikaTy);
      dodajJesliIstnieje(element, ustawienia.grafikaWszyscy.przedmioty, grafikaWszyscy);
      if (game.user.isGM && ustawienia.uprawnienia.przedmioty?.gm) dodajJesliIstnieje(element, true, uprawnienia);
    }

    if (typ === "journal") {
      if (game.user.isGM && ustawienia.uprawnienia.dzienniki?.gm) dodajJesliIstnieje(element, true, uprawnienia);
    }

    if (typ === "rolltable") {
      dodajJesliIstnieje(element, ustawienia.rzuc.tablice, rzuc);
    }

    if (typ === "macro") {
      dodajJesliIstnieje(element, ustawienia.uzyjMakra.makra, uzyjMakra);
    }
  });
}

function shouldDisplay(ustawienie) {
  return (game.user.isGM && ustawienie?.gm) || (!game.user.isGM && ustawienie?.gracze);
}

function dodajJesliIstnieje(element, ustawienie, funkcjaPrzycisku) {
  if (ustawienie !== true && !shouldDisplay(ustawienie)) return;

  const przycisk = funkcjaPrzycisku(element);
  if (przycisk instanceof HTMLElement) {
    element.appendChild(przycisk);
  }
}
