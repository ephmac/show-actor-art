// Dodawanie przycisków do aktorów
Hooks.on("renderActorDirectory", (app, html, data) => {
    const actors = html.find(".directory-item.document");
    actors.each((index, actorElement) => {
        const actorId = actorElement.dataset.documentId;
        if (!actorId) return;

        let artIcon = document.createElement("a");
        enrichSidebar(artIcon, actors, index);

        // Obsługa kliknięcia przycisku
        artIcon.addEventListener("click", () => {
            const actor = game.actors.get(actorId);
            if (!actor || !actor.img) {
                ui.notifications.warn("This actor has no artwork set.");
                return;
            }
            showArtToAll(actor.img, actor.name);
        });
    });
});

// Dodawanie przycisków do przedmiotów
Hooks.on("renderItemDirectory", (app, html, data) => {
    const items = html.find(".directory-item.document");
    items.each((index, itemElement) => {
        const itemId = itemElement.dataset.documentId;
        if (!itemId) return;

        let artIcon = document.createElement("a");
        enrichSidebar(artIcon, items, index);

        // Obsługa kliknięcia przycisku
        artIcon.addEventListener("click", () => {
            const item = game.items.get(itemId);
            if (!item || !item.img) {
                ui.notifications.warn("This item has no artwork set.");
                return;
            }
            showArtToAll(item.img, item.name);
        });
    });
});

// Funkcja wspólna do dodawania przycisków
function enrichSidebar(artIcon, elements, index) {
    artIcon.classList.add("roll-table"); // Klasa CSS z tabel
    artIcon.setAttribute("data-action", "show-art"); // Atrybut akcji
    artIcon.setAttribute("title", "Show Art"); // Tytuł przycisku
    let icon = document.createElement("i");
    icon.classList.add("fas", "fa-palette"); // Ikona
    artIcon.appendChild(icon);
    elements[index].appendChild(artIcon); // Dodanie przycisku do elementu
}

// Funkcja wyświetlania obrazu wszystkim graczom
function showArtToAll(img, name) {
    console.log(`Sending art to all: ${name}`);

    // Stwórz instancję ImagePopout
    const popout = new ImagePopout(img, { title: name });

    // Renderuj lokalnie
    popout.render(true);

    // Automatycznie udostępnij obraz wszystkim graczom
    popout.shareImage();
}
