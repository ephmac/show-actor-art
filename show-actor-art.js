Hooks.once("init", () => {
    // Rejestracja ustawień modułu
    game.settings.register("show-actor-art", "buttonSettings", {
        name: "Button Configuration",
        hint: "Configure visibility and placement of buttons.",
        scope: "world",
        config: false,
        type: Object,
        default: {
            onlyYou: {
                placement: { actors: true, items: true },
                visibility: { gm: true, players: true }
            },
            everyone: {
                placement: { actors: true, items: true },
                visibility: { gm: true, players: true }
            },
            ownership: {
                placement: { actors: true, items: true, journal: true }
            }
        }
    });

    // Rejestracja menu ustawień
    game.settings.registerMenu("show-actor-art", "buttonSettingsMenu", {
        name: game.i18n.localize("SHOW_ACTOR_ART.BUTTON_SETTINGS_MENU"),
        label: game.i18n.localize("SHOW_ACTOR_ART.BUTTON_SETTINGS_MENU_LABEL"),
        hint: game.i18n.localize("SHOW_ACTOR_ART.BUTTON_SETTINGS_MENU_HINT"),
        icon: "fas fa-cogs",
        type: ButtonSettingsForm,
        restricted: true
    });

});

Hooks.once("ready", () => {
    // Odświeżanie sidebaru przy zmianach w ustawieniach
    watchSettingsForChanges();
});

Hooks.on("renderActorDirectory", (app, html, data) => {
    const actors = html.find(".directory-item.document");
    actors.each((index, actorElement) => {
        enrichSidebar(actorElement, "actor");
    });
});

Hooks.on("renderItemDirectory", (app, html, data) => {
    const items = html.find(".directory-item.document");
    items.each((index, itemElement) => {
        enrichSidebar(itemElement, "item");
    });
});

Hooks.on("renderJournalDirectory", (app, html, data) => {
    const journals = html.find(".directory-item.document");
    journals.each((index, journalElement) => {
        enrichSidebar(journalElement, "journal");
    });
});

// Klasa dla formularza dynamicznego ustawień
class ButtonSettingsForm extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "button-settings-form",
            title: "Button Configuration",
            template: "modules/show-actor-art/templates/settings-form.html",
            width: 600,
            closeOnSubmit: true
        });
    }

    getData() {
        // Pobierz bieżące ustawienia
        return {
            settings: game.settings.get("show-actor-art", "buttonSettings")
        };
    }

    async _updateObject(event, formData) {
        // Zapisz zmienione ustawienia
        const updatedSettings = expandObject(formData);
        await game.settings.set("show-actor-art", "buttonSettings", updatedSettings);
        ui.notifications.info("Button settings updated.");
        refreshSidebarButtons();
    }
}

// Funkcja do odświeżania sidebaru
function refreshSidebarButtons() {
    const actorDirectory = ui.actors;
    if (actorDirectory) actorDirectory.render(true);

    const itemDirectory = ui.items;
    if (itemDirectory) itemDirectory.render(true);

    const journalDirectory = ui.journal;
    if (journalDirectory) journalDirectory.render(true);
}

// Funkcja dodająca przyciski w zależności od ustawień
function enrichSidebar(element, type) {
    const settings = game.settings.get("show-actor-art", "buttonSettings");

    // Przyciski "Only You"
    if (type === "actor" && settings.onlyYou.placement.actors && shouldDisplayButton(settings.onlyYou.visibility)) {
        addButton(element, "onlyYou");
    }
    if (type === "item" && settings.onlyYou.placement.items && shouldDisplayButton(settings.onlyYou.visibility)) {
        addButton(element, "onlyYou");
    }

    // Przyciski "Everyone"
    if (type === "actor" && settings.everyone.placement.actors && shouldDisplayButton(settings.everyone.visibility)) {
        addButton(element, "everyone");
    }
    if (type === "item" && settings.everyone.placement.items && shouldDisplayButton(settings.everyone.visibility)) {
        addButton(element, "everyone");
    }

    // Przyciski "Ownership"
    if (type === "actor" && settings.ownership.placement.actors) {
        addButton(element, "ownership");
    }
    if (type === "item" && settings.ownership.placement.items) {
        addButton(element, "ownership");
    }
    if (type === "journal" && settings.ownership.placement.journal) {
        addButton(element, "ownership");
    }
}

// Funkcja tworząca przyciski z działaniami
function addButton(element, buttonType) {
    let buttonLabel = "";
    let buttonClass = "";

    // Ustawienia etykiet i ikon dla przycisków
    if (buttonType === "onlyYou") {
        buttonLabel = "SHOW_ACTOR_ART.TOOLTIP_ONLY_YOU";
        buttonClass = "fa-eye";
    } else if (buttonType === "everyone") {
        buttonLabel = "SHOW_ACTOR_ART.TOOLTIP_EVERYONE";
        buttonClass = "fa-share-alt";
    } else if (buttonType === "ownership") {
    buttonClass = "fa-lock"; // Ikona przycisku Ownership

    // Pobierz element i ustaw dynamiczną podpowiedź
    const entityId = element.dataset.documentId;
    const entity = game.actors.get(entityId) || game.items.get(entityId) || game.journal.get(entityId);

    if (entity) {
        const ownershipLevel = entity.ownership?.default || 0;
        const ownershipLabels = {
            0: game.i18n.localize("SHOW_ACTOR_ART.OWNERSHIP_NONE"),
            1: game.i18n.localize("SHOW_ACTOR_ART.OWNERSHIP_LIMITED"),
            2: game.i18n.localize("SHOW_ACTOR_ART.OWNERSHIP_OBSERVER"),
            3: game.i18n.localize("SHOW_ACTOR_ART.OWNERSHIP_OWNER")
        };

        buttonLabel = ownershipLabels[ownershipLevel] || "Unknown"; // Dynamiczny tekst
    }
}

    // Tworzenie przycisku
    const button = createButton(buttonClass, buttonLabel, async () => {
        const entityId = element.dataset.documentId;
        const entity = game.actors.get(entityId) || game.items.get(entityId) || game.journal.get(entityId);

        if (!entity) {
            console.error("Entity not found for button action.");
            return;
        }

        // Obsługa działania dla każdego typu przycisku
        if (buttonType === "onlyYou") {
            if (!entity.img) {
                console.warn("This entity has no artwork set.");
                return;
            }
            // Wyświetl grafikę tylko dla siebie
            new ImagePopout(entity.img, { title: entity.name }).render(true);
        } else if (buttonType === "everyone") {
            if (!entity.img) {
                console.warn("This entity has no artwork set.");
                return;
            }
            // Udostępnij grafikę wszystkim
            const popout = new ImagePopout(entity.img, { title: entity.name });
            popout.render(true);
            popout.shareImage();
        } else if (buttonType === "ownership") {
            // Przełącz poziom uprawnień cyklicznie
            const ownershipLevels = [0, 1, 2, 3]; // None, Limited, Observer, Owner
            const currentOwnership = entity.ownership?.default || 0;
            const nextOwnership = (currentOwnership + 1) % 4;

            try {
                await entity.update({ ownership: { default: nextOwnership } });
                refreshSidebarButtons(); // Odśwież sidebar, aby zaktualizować kolor przycisku
            } catch (err) {
                console.error("Failed to update ownership:", err);
            }
        }
    });

    // Ustaw kolor przycisku "Ownership" w zależności od poziomu uprawnień
    if (buttonType === "ownership") {
        const entityId = element.dataset.documentId;
        const entity = game.actors.get(entityId) || game.items.get(entityId) || game.journal.get(entityId);

        if (entity) {
            const ownershipLevel = entity.ownership?.default || 0;
            const ownershipColors = {
                0: "#cc6666", // None (Czerwony)
                1: "#ff8000", // Limited (Pomarańczowy)
                2: "#ffff00", // Observer (Żółty)
                3: "#66cc66"  // Owner (Zielony)
            };

            button.style.color = ownershipColors[ownershipLevel] || "#cccccc";
        }
    }

    // Dodaj przycisk do elementu
    element.appendChild(button);
}

// Funkcja pomocnicza do tworzenia przycisku
function createButton(iconClass, tooltipKey, onClick) {
    let button = document.createElement("a");
    button.classList.add("roll-table");
    button.setAttribute("title", game.i18n.localize(tooltipKey));
    let icon = document.createElement("i");
    icon.classList.add("fas", iconClass);
    button.appendChild(icon);
    button.addEventListener("click", onClick);
    return button;
}

// Funkcja pomocnicza do tworzenia przycisku
function createButton(iconClass, tooltipKey, onClick) {
    let button = document.createElement("a");
    button.classList.add("roll-table");
    button.setAttribute("title", game.i18n.localize(tooltipKey));
    let icon = document.createElement("i");
    icon.classList.add("fas", iconClass);
    button.appendChild(icon);
    button.addEventListener("click", onClick);
    return button;
}

// Funkcja sprawdzająca widoczność przycisku
function shouldDisplayButton(visibilitySettings) {
    if (visibilitySettings.gm && game.user.isGM) return true;
    if (visibilitySettings.players && !game.user.isGM) return true;
    return false;
}
