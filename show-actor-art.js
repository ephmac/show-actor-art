Hooks.once("init", () => {
    // Ustawienia dla przycisku "Show Art - Only You"
    game.settings.register("show-actor-art", "onlyYouVisibility", {
        name: game.i18n.localize("SHOW_ACTOR_ART.ONLY_YOU_VISIBILITY"),
        hint: game.i18n.localize("SHOW_ACTOR_ART.ONLY_YOU_VISIBILITY_HINT"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "none": game.i18n.localize("SHOW_ACTOR_ART.VISIBILITY_NONE"),
            "gm-only": game.i18n.localize("SHOW_ACTOR_ART.VISIBILITY_GM_ONLY"),
            "gm-and-players": game.i18n.localize("SHOW_ACTOR_ART.VISIBILITY_GM_AND_PLAYERS")
        },
        default: "gm-and-players"
    });

    game.settings.register("show-actor-art", "onlyYouPlacement", {
        name: game.i18n.localize("SHOW_ACTOR_ART.ONLY_YOU_PLACEMENT"),
        hint: game.i18n.localize("SHOW_ACTOR_ART.ONLY_YOU_PLACEMENT_HINT"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "actors": game.i18n.localize("SHOW_ACTOR_ART.PLACEMENT_ACTORS"),
            "items": game.i18n.localize("SHOW_ACTOR_ART.PLACEMENT_ITEMS"),
            "actors-and-items": game.i18n.localize("SHOW_ACTOR_ART.PLACEMENT_ACTORS_AND_ITEMS")
        },
        default: "actors-and-items"
    });

    // Ustawienia dla przycisku "Show Art - Everyone"
    game.settings.register("show-actor-art", "everyoneVisibility", {
        name: game.i18n.localize("SHOW_ACTOR_ART.EVERYONE_VISIBILITY"),
        hint: game.i18n.localize("SHOW_ACTOR_ART.EVERYONE_VISIBILITY_HINT"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "none": game.i18n.localize("SHOW_ACTOR_ART.VISIBILITY_NONE"),
            "gm-only": game.i18n.localize("SHOW_ACTOR_ART.VISIBILITY_GM_ONLY"),
            "gm-and-players": game.i18n.localize("SHOW_ACTOR_ART.VISIBILITY_GM_AND_PLAYERS")
        },
        default: "gm-and-players"
    });

    game.settings.register("show-actor-art", "everyonePlacement", {
        name: game.i18n.localize("SHOW_ACTOR_ART.EVERYONE_PLACEMENT"),
        hint: game.i18n.localize("SHOW_ACTOR_ART.EVERYONE_PLACEMENT_HINT"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "actors": game.i18n.localize("SHOW_ACTOR_ART.PLACEMENT_ACTORS"),
            "items": game.i18n.localize("SHOW_ACTOR_ART.PLACEMENT_ITEMS"),
            "actors-and-items": game.i18n.localize("SHOW_ACTOR_ART.PLACEMENT_ACTORS_AND_ITEMS")
        },
        default: "actors-and-items"
    });
});

Hooks.on("renderActorDirectory", (app, html, data) => {
    const actors = html.find(".directory-item.document");
    actors.each((index, actorElement) => {
        enrichSidebar(actorElement);
    });
});

Hooks.on("renderItemDirectory", (app, html, data) => {
    const items = html.find(".directory-item.document");
    items.each((index, itemElement) => {
        enrichSidebar(itemElement);
    });
});

// Funkcja do dodawania przycisków na podstawie ustawień
function enrichSidebar(element) {
    // Sprawdzenie ustawień dla przycisków
    const onlyYouVisibility = game.settings.get("show-actor-art", "onlyYouVisibility");
    const onlyYouPlacement = game.settings.get("show-actor-art", "onlyYouPlacement");
    const everyoneVisibility = game.settings.get("show-actor-art", "everyoneVisibility");
    const everyonePlacement = game.settings.get("show-actor-art", "everyonePlacement");

    // Tworzenie przycisku "Show Art - Only You" (jeśli włączony i pasuje do typu)
    if (shouldDisplayButton(onlyYouVisibility) && matchesPlacement(onlyYouPlacement, element)) {
        let localButton = createButton(
            "fa-eye", 
            "SHOW_ACTOR_ART.TOOLTIP_ONLY_YOU", 
            () => {
                const entityId = element.dataset.documentId;
                const entity = game.actors.get(entityId) || game.items.get(entityId);
                if (!entity || !entity.img) {
                    ui.notifications.warn("This entity has no artwork set.");
                    return;
                }
                new ImagePopout(entity.img, { title: entity.name }).render(true);
            }
        );
        element.appendChild(localButton);
    }

    // Tworzenie przycisku "Show Art - Everyone" (jeśli włączony i pasuje do typu)
    if (shouldDisplayButton(everyoneVisibility) && matchesPlacement(everyonePlacement, element)) {
        let globalButton = createButton(
            "fa-share-alt", 
            "SHOW_ACTOR_ART.TOOLTIP_EVERYONE", 
            () => {
                const entityId = element.dataset.documentId;
                const entity = game.actors.get(entityId) || game.items.get(entityId);
                if (!entity || !entity.img) {
                    ui.notifications.warn("This entity has no artwork set.");
                    return;
                }
                const popout = new ImagePopout(entity.img, { title: entity.name });
                popout.render(true);
                popout.shareImage();
            }
        );
        element.appendChild(globalButton);
    }
}

// Funkcja pomocnicza: tworzenie przycisku
function createButton(iconClass, tooltipKey, onClick) {
    let button = document.createElement("a");
    button.classList.add("roll-table"); // Klasa CSS
    button.setAttribute("title", game.i18n.localize(tooltipKey)); // Tłumaczenie podpowiedzi
    let icon = document.createElement("i");
    icon.classList.add("fas", iconClass); // Dodanie klasy ikony
    button.appendChild(icon);
    button.addEventListener("click", onClick); // Obsługa kliknięcia
    return button;
}

// Funkcja pomocnicza: sprawdzanie widoczności przycisków
function shouldDisplayButton(setting) {
    if (setting === "none") return false;
    if (setting === "gm-only" && !game.user.isGM) return false;
    return true;
}

// Funkcja pomocnicza: sprawdzanie, czy przycisk pasuje do typu elementu
function matchesPlacement(setting, element) {
    const isActor = element.dataset.documentId && game.actors.get(element.dataset.documentId);
    const isItem = element.dataset.documentId && game.items.get(element.dataset.documentId);

    if (setting === "actors") return isActor;
    if (setting === "items") return isItem;
    if (setting === "actors-and-items") return isActor || isItem;
    return false;
}
