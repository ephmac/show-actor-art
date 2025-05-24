export function uprawnienia(element) {

  const entityId = element.dataset.id ?? element.dataset.entryId ?? element.dataset.documentId;
  const entity = game.actors?.get(entityId) ?? game.items?.get(entityId) ?? game.journal?.contents.find(j => j.id === entityId);
  if (!entity) return null;

  const etykiety = {
  0: game.i18n.localize("sidebarButtons.uprawnieniaNone"),
  1: game.i18n.localize("sidebarButtons.uprawnieniaLimited"),
  2: game.i18n.localize("sidebarButtons.uprawnieniaObserver"),
  3: game.i18n.localize("sidebarButtons.uprawnieniaOwner")
  };  
  
  const button = document.createElement("a");
  button.classList.add("sidebarButtons_przycisk", "sidebarButtons_uprawnienia");
  button.title = etykiety[pobierzPoziomUprawnien(entity)];
  button.dataset.entityId = entityId;

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-lock");
  button.appendChild(icon);

  kolorujPrzyciskUprawnien(button, entity.ownership?.default ?? 0);

  button.addEventListener("click", () => {
    ustawKolejnyPoziomUprawnien(entity);
  });

  return button;
}

export function pobierzPoziomUprawnien(entity) {
  return entity?.ownership?.default ?? 0;
}

export async function ustawKolejnyPoziomUprawnien(entity) {
  const aktualny = pobierzPoziomUprawnien(entity);
  const nowy = (aktualny + 1) % 4;

    await entity.update({ ownership: { default: nowy } });
    Hooks.callAll("refreshSidebarButtons");
}

function kolorujPrzyciskUprawnien(button, poziom) {
  const kolory = {
    0: "#cc6666", // None
    1: "#ff8000", // Limited
    2: "#ffff00", // Observer
    3: "#66cc66"  // Owner
  };

  button.style.color = kolory[poziom] || "#cccccc";
}