// 🔹 Rejestracja ustawień modułu
Hooks.once("init", () => {
    game.settings.register("show-actor-art", "buttonSettings", {
        name: "Button Configuration",
        hint: "Configure visibility and placement of buttons.",
        scope: "world",
        config: false,
        type: Object,
        default: {
            onlyYou: { placement: { actors: true, items: true }, visibility: { gm: true, players: true } },
            everyone: { placement: { actors: true, items: true }, visibility: { gm: true, players: true } },
            ownership: { placement: { actors: true, items: true, journal: true } }
        }
    });

    game.settings.registerMenu("show-actor-art", "buttonSettingsMenu", {
        name: game.i18n.localize("SHOW_ACTOR_ART.BUTTON_SETTINGS_MENU"),
        label: game.i18n.localize("SHOW_ACTOR_ART.BUTTON_SETTINGS_MENU_LABEL"),
        hint: game.i18n.localize("SHOW_ACTOR_ART.BUTTON_SETTINGS_MENU_HINT"),
        icon: "fas fa-cogs",
        type: ButtonSettingsForm,
        restricted: true
    });
});

// 🔹 Inicjalizacja modułu
Hooks.once("ready", () => {
    watchSettingsForChanges();
});

// 🔹 Obsługa renderowania sidebaru
Hooks.on("renderActorDirectory", (app, html, data) => enrichSidebar(html, "actor"));
Hooks.on("renderItemDirectory", (app, html, data) => enrichSidebar(html, "item"));
Hooks.on("renderJournalDirectory", (app, html, data) => enrichSidebar(html, "journal"));

// 🔹 Klasa formularza ustawień
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
        return { settings: game.settings.get("show-actor-art", "buttonSettings") };
    }

    async _updateObject(event, formData) {
        const updatedSettings = expandObject(formData);
        await game.settings.set("show-actor-art", "buttonSettings", updatedSettings);
        ui.notifications.info("Button settings updated.");
        refreshSidebarButtons();
    }
}

// 🔹 Odświeżanie sidebaru
function refreshSidebarButtons() {
    [ui.actors, ui.items, ui.journal].forEach(dir => dir?.render(true));
}

// 🔹 Dodawanie przycisków do sidebaru
function enrichSidebar(html, type) {
    console.log("📂 enrichSidebar() wywołane dla:", type);
    const settings = game.settings.get("show-actor-art", "buttonSettings");

    html.find(".directory-item.document").each((_, element) => {
        // Przyciski "Only You" (widoczność zależna od ustawień)
        if (
            (type === "actor" && settings.onlyYou.placement.actors && shouldDisplayButton(settings.onlyYou.visibility)) ||
            (type === "item" && settings.onlyYou.placement.items && shouldDisplayButton(settings.onlyYou.visibility))
        ) {
            addButton(element, "onlyYou");
        }

        // Przyciski "Everyone" (widoczność zależna od ustawień)
        if (
            (type === "actor" && settings.everyone.placement.actors && shouldDisplayButton(settings.everyone.visibility)) ||
            (type === "item" && settings.everyone.placement.items && shouldDisplayButton(settings.everyone.visibility))
        ) {
            addButton(element, "everyone");
        }

        // Przyciski "Ownership" (widoczne TYLKO dla MG)
        if (
            (type === "actor" && settings.ownership.placement.actors && game.user.isGM) ||
            (type === "item" && settings.ownership.placement.items && game.user.isGM) ||
            (type === "journal" && settings.ownership.placement.journal && game.user.isGM)
        ) {
            addButton(element, "ownership");
        }
    });
}

// 🔹 Tworzenie przycisku i obsługa akcji
function addButton(element, buttonType) {
    const buttonSettings = {
        onlyYou: { icon: "fa-eye", tooltip: "SHOW_ACTOR_ART.TOOLTIP_ONLY_YOU" },
        everyone: { icon: "fa-share-alt", tooltip: "SHOW_ACTOR_ART.TOOLTIP_EVERYONE" },
        ownership: { icon: "fa-lock", tooltip: "SHOW_ACTOR_ART.TOOLTIP_OWNERSHIP" }
    };

    if (!buttonSettings[buttonType]) return;

    const button = createButton(
        buttonSettings[buttonType].icon,
        buttonSettings[buttonType].tooltip,
        () => handleButtonClick(buttonType, element),
        buttonType,
        element
    );

    element.appendChild(button);
}

// 🔹 Obsługa kliknięcia przycisku
async function handleButtonClick(buttonType, element) {
    const entityId = element.dataset.documentId;
    const entity = game.actors.get(entityId) || game.items.get(entityId) || game.journal.get(entityId);

    if (!entity) {
        console.error("❌ Entity not found for button action.");
        return;
    }

    if (buttonType === "onlyYou" || buttonType === "everyone") {
        if (!entity.img) {
            console.warn("⚠️ This entity has no artwork set.");
            return;
        }
        const popout = new ImagePopout(entity.img, { title: entity.name });
        popout.render(true);
        if (buttonType === "everyone") popout.shareImage();
    } 
    else if (buttonType === "ownership") {
        const ownershipLevels = [0, 1, 2, 3]; // None, Limited, Observer, Owner
        const currentOwnership = entity.ownership?.default || 0;
        const nextOwnership = (currentOwnership + 1) % ownershipLevels.length;

        try {
            await entity.update({ ownership: { default: nextOwnership } });
            refreshSidebarButtons();
        } catch (err) {
            console.error("❌ Failed to update ownership:", err);
        }
    }
}

// 🔹 Tworzenie przycisku
function createButton(iconClass, tooltipKey, onClick, buttonType, element) {
    let button = document.createElement("a");
    button.classList.add("roll-table", buttonType);
    button.setAttribute("title", game.i18n.localize(tooltipKey));

    Object.assign(button.style, {
        all: "unset",
        display: "flex",
        width: "24px",
        height: "24px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        textDecoration: "none",
        marginLeft: "1px",
        cursor: "pointer",
        border: "1px solid transparent",
        transition: "border-color 0.2s, transform 0.2s"
    });

    let icon = document.createElement("i");
    icon.classList.add("fas", iconClass);
    icon.style.fontSize = "0.8rem";
    button.appendChild(icon);
    button.addEventListener("click", onClick);

    button.addEventListener("mouseenter", () => {
        button.dataset.originalColor = button.style.color;  // 🔹 Zapamiętaj oryginalny kolor
    
        button.style.borderColor = "#ffffff";              // 🔹 Pojawiająca się ramka
        button.style.transform = "scale(1.1)";             // 🔹 Subtelne powiększenie
    
        // 🔹 Zmieniamy kolor tylko dla "onlyYou" i "everyone"
        if (buttonType !== "ownership") {
            button.style.color = "#ffcc00";               // 🔹 Zmiana koloru ikony
        }
    
        // 🔹 Jeśli to "ownership", zmieniamy tooltip na aktualny poziom uprawnień
        if (buttonType === "ownership") {
            updateOwnershipTooltip(button, element);
        }
    });
    
    button.addEventListener("mouseleave", () => {
        button.style.borderColor = "transparent";         // 🔹 Ukryj ramkę
        button.style.transform = "scale(1)";              // 🔹 Przywróć normalny rozmiar
    
        // 🔹 Przywróć oryginalny kolor tylko jeśli to nie "ownership"
        if (buttonType !== "ownership") {
            button.style.color = button.dataset.originalColor;
        }
    
        // 🔹 Jeśli to "ownership", przywróć domyślny tooltip
        if (buttonType === "ownership") {
            button.setAttribute("title", game.i18n.localize("SHOW_ACTOR_ART.TOOLTIP_OWNERSHIP"));
        }
    });
    
    button.addEventListener("mouseleave", () => {
        button.style.borderColor = "transparent";
        button.style.transform = "scale(1)";
    });

    // 🔹 Jeśli to przycisk Ownership, ustaw kolor zgodnie z poziomem uprawnień
    if (buttonType === "ownership") {
        button.classList.add("ownership-button");
        updateOwnershipColor(button, element);
    }

    return button;
}

// 🔹 Automatyczna aktualizacja koloru
function updateOwnershipColor(button, element) {
    if (!element || !element.dataset || !element.dataset.documentId) {
        console.warn("❌ `element` nie ma poprawnego ID dokumentu.");
        return;
    }

    const entityId = element.dataset.documentId;
    const entity = game.actors.get(entityId) || game.items.get(entityId) || game.journal.get(entityId);

    if (!entity) {
        console.warn("❌ Nie znaleziono encji dla ID:", entityId);
        return;
    }

    // Pobranie poziomu uprawnień i przypisanie odpowiedniego koloru
    const ownershipLevel = entity.ownership?.default ?? 0;
    const ownershipColors = {
        0: "#cc6666", // None (Czerwony)
        1: "#ff8000", // Limited (Pomarańczowy)
        2: "#ffff00", // Observer (Żółty)
        3: "#66cc66"  // Owner (Zielony)
    };

    button.style.color = ownershipColors[ownershipLevel] || "#cccccc";
    console.log(`🎨 Ustawiono kolor Ownership Button dla ${entityId}:`, button.style.color);
}

Hooks.on("updateActor", (actor) => updateOwnershipColorForAll());
Hooks.on("updateItem", (item) => updateOwnershipColorForAll());
Hooks.on("updateJournalEntry", (journal) => updateOwnershipColorForAll());

function updateOwnershipColorForAll() {
    document.querySelectorAll(".ownership-button").forEach(button => {
        const element = button.closest(".directory-item.document");
        if (element) updateOwnershipColor(button, element);
    });
}

function updateOwnershipTooltip(button, element) {
    if (!element || !element.dataset || !element.dataset.documentId) {
        console.warn("❌ `element` nie ma poprawnego ID dokumentu.");
        return;
    }

    const entityId = element.dataset.documentId;
    const entity = game.actors.get(entityId) || game.items.get(entityId) || game.journal.get(entityId);

    if (!entity) {
        console.warn("❌ Nie znaleziono encji dla ID:", entityId);
        return;
    }

    const ownershipLevel = entity.ownership?.default ?? 0;
    const ownershipLabels = {
        0: game.i18n.localize("SHOW_ACTOR_ART.OWNERSHIP_NONE"),
        1: game.i18n.localize("SHOW_ACTOR_ART.OWNERSHIP_LIMITED"),
        2: game.i18n.localize("SHOW_ACTOR_ART.OWNERSHIP_OBSERVER"),
        3: game.i18n.localize("SHOW_ACTOR_ART.OWNERSHIP_OWNER")
    };

    button.setAttribute("title", ownershipLabels[ownershipLevel] || "Nieznane uprawnienia");
}

// 🔹 Sprawdzanie widoczności przycisków
function shouldDisplayButton(visibilitySettings) {
    return (visibilitySettings.gm && game.user.isGM) || (visibilitySettings.players && !game.user.isGM);
}
