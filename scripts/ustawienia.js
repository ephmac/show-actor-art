export function rejestrujUstawienia() {
  
  game.settings.register("show-actor-art", "przyciski", {
    scope: "world",
    config: false,
    type: Object,
    default: {
      grafikaTy: {
        aktorzy: { gm: true, gracze: true },
        przedmioty: { gm: true, gracze: true }
      },
      grafikaWszyscy: {
        aktorzy: { gm: true, gracze: true },
        przedmioty: { gm: true, gracze: true }
      },
      uprawnienia: {
        aktorzy: { gm: true },
        przedmioty: { gm: true },
        dzienniki: { gm: true }
      },
      rzuc: {
        tablice: { gm: true, gracze: true }
      },
      uzyjMakra: {
        makra: { gm: true, gracze: true }
      }
    }
  });

  game.settings.registerMenu("show-actor-art", "przyciskiMenu", {
    name: game.i18n.localize("sidebarButtons.ustawieniaSidebarButtons"),
    label: "",
    hint: game.i18n.localize("sidebarButtons.ustawieniaPodpowiedz"),
    icon: "fas fa-cogs",
    type: ButtonSettingsForm,
    restricted: true
  });
}

export class ButtonSettingsForm extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "przyciski-form",
      title: game.i18n.localize("sidebarButtons.ustawieniaSidebarButtons"),
      template: "modules/show-actor-art/templates/ustawienia.hbs",
      width: 300,
      closeOnSubmit: false
    });
  }

  getData() {
    return {
      ustawienia: game.settings.get("show-actor-art", "przyciski")
    };
  }

  activateListeners(html) {
  super.activateListeners(html);

  html.find("input[type='checkbox']").on("change", async () => {
    const formData = new FormData(this.form);
    const expanded = foundry.utils.expandObject(Object.fromEntries(formData));
    await game.settings.set("show-actor-art", "przyciski", expanded);

    Hooks.callAll("refreshSidebarButtons");
    game.socket.emit("module.show-actor-art", { type: "refresh" });
  });

  html.find(".sidebarButtons_przyciskZamknij").on("click", () => {
    this.close();
  });
}


}
