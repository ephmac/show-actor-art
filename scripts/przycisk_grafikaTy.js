export function grafikaTy(element) {

  const entityId = element.dataset.id ?? element.dataset.entryId ?? element.dataset.documentId;
  const entity = game.actors?.get(entityId) ?? game.items?.get(entityId);
  if (!entity || !entity.img) return null;


  const button = document.createElement("a");
  button.classList.add("sidebarButtons_przycisk", "sidebarButtons_grafikaTy");
  button.title = game.i18n.localize("sidebarButtons.grafikaTyPodpowiedz");
  button.dataset.entityId = entityId;

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-eye");
  button.appendChild(icon);

  button.addEventListener("click", () => {
    const popout = new ImagePopout(entity.img, { title: entity.name });
    popout.render(true);
  });

  return button;
}