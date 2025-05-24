export function rzuc(element) {

  const entityId = element.dataset.id ?? element.dataset.entryId ?? element.dataset.documentId;
  const entity = game.tables?.get(entityId);

  if (!entity || !entity.img) return null;


  const button = document.createElement("a");
  button.classList.add("sidebarButtons_przycisk", "sidebarButtons_rzuc");
  button.title = game.i18n.localize("sidebarButtons.rzucPodpowiedz");
  button.dataset.entityId = entityId;

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-dice-d20");
  button.appendChild(icon);

  button.addEventListener("click", () => {
    entity.draw();
  });

  return button;
}