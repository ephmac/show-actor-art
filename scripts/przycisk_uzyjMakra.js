export function uzyjMakra(element) {

  const entityId = element.dataset.id ?? element.dataset.entryId ?? element.dataset.documentId;
  const entity = game.macros?.get(entityId);
  if (!entity || !entity.img) return null;


  const button = document.createElement("a");
  button.classList.add("sidebarButtons_przycisk", "sidebarButtons_uzyjMakra");
  button.title = game.i18n.localize("sidebarButtons.uzyjMakraPodpowiedz");
  button.dataset.entityId = entityId;

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-play");
  button.appendChild(icon);

  button.addEventListener("click", () => {
    const macro = game.macros?.get(entity.id);
    macro.execute();
  });

  return button;
}