let dialogWsparcie = false;

export function otworzDialogWsparcia() {

  if (dialogWsparcie) { dialogWsparcie.bringToTop(); return; } // Zapobiega wielokrotnemu otwieraniu

    const lang = {
        "pl": {
            Tytul: "Wesprzyj Twórcę",
            Powitanie: "Dzięki, że korzystasz z mojego modułu! ❤️",
            Tresc: "Jeśli chcesz pomóc w jego rozwoju, możesz:",
            Patreon: "Wesprzeć mnie na Patronite",
            Kofi: "Postawić mi kawę na Ko-fi",
            Discord: "Dołączyć do Discorda",
            Footer: "Każda forma wsparcia daje mi więcej czasu na rozwój i aktualizacje!",
            Zamknij: "Zamknij"
        },
        "en": {
            Tytul: "Support the Creator",
            Powitanie: "Thanks for using my module! ❤️",
            Tresc: "If you'd like to help me keep it going, you can:",
            Patreon: "Support me on Patreon",
            Kofi: "Buy me a coffee on Ko-fi",
            Discord: "Join the Discord",
            Footer: "Every bit of support helps me spend more time improving this project!",
            Zamknij: "Close"
        },
        "de": {
            Tytul: "Unterstütze den Entwickler",
            Powitanie: "Danke, dass du mein Modul benutzt! ❤️",
            Tresc: "Wenn du mich unterstützen möchtest, kannst du das hier tun:",
            Patreon: "Unterstütze mich auf Patreon",
            Kofi: "Spendiere mir einen Kaffee auf Ko-fi",
            Discord: "Tritt dem Discord bei",
            Footer: "Jede Unterstützung hilft mir, mehr Zeit in die Entwicklung zu stecken!",
            Zamknij: "Schließen"
        },
        "es": {
            Tytul: "Apoya al creador",
            Powitanie: "¡Gracias por usar mi módulo! ❤️",
            Tresc: "Si quieres ayudarme a seguir trabajando, puedes:",
            Patreon: "Apóyame en Patreon",
            Kofi: "Invítame un café en Ko-fi",
            Discord: "Únete al Discord",
            Footer: "Cada apoyo me ayuda a dedicar más tiempo al desarrollo del proyecto.",
            Zamknij: "Cerrar"
        },
        "fr": {
            Tytul: "Soutenir le créateur",
            Powitanie: "Merci d'utiliser mon module ! ❤️",
            Tresc: "Si vous souhaitez m'aider à continuer, vous pouvez :",
            Patreon: "Me soutenir sur Patreon",
            Kofi: "M'offrir un café sur Ko-fi",
            Discord: "Rejoindre le Discord",
            Footer: "Chaque soutien me permet de consacrer plus de temps au développement !",
            Zamknij: "Fermer"
        },
        "ja": {
            Tytul: "開発者を支援する",
            Powitanie: "モジュールをご利用いただきありがとうございます！❤️",
            Tresc: "サポートしていただける場合は、以下からお願いします：",
            Patreon: "Patreonで支援する",
            Kofi: "Ko-fiでコーヒーをおごる",
            Discord: "Discordに参加する",
            Footer: "ご支援は、開発により多くの時間を割く助けになります！",
            Zamknij: "閉じる"
        },
        "pt": {
            Tytul: "Apoiar o Criador",
            Powitanie: "Obrigado por usar meu módulo! ❤️",
            Tresc: "Se quiser ajudar no desenvolvimento, você pode:",
            Patreon: "Apoie no Patreon",
            Kofi: "Me pague um café no Ko-fi",
            Discord: "Entre no Discord",
            Footer: "Todo apoio me ajuda a dedicar mais tempo ao projeto!",
            Zamknij: "Fechar"
        },
        "ru": {
            Tytul: "Поддержать автора",
            Powitanie: "Спасибо за использование моего модуля! ❤️",
            Tresc: "Если хотите поддержать развитие, можете:",
            Patreon: "Поддержать на Patreon",
            Kofi: "Угостить кофе на Ko-fi",
            Discord: "Присоединиться к Discord",
            Footer: "Любая поддержка помогает мне уделять больше времени разработке!",
            Zamknij: "Закрыть"
        },
        "zh": {
            Tytul: "支持开发者",
            Powitanie: "感谢使用我的模块！❤️",
            Tresc: "如果你愿意支持我，可以：",
            Patreon: "在 Patreon 上支持我",
            Kofi: "在 Ko-fi 上请我喝咖啡",
            Discord: "加入 Discord 社群",
            Footer: "每一份支持都能让我投入更多时间开发此项目！",
            Zamknij: "关闭"
        }
    };

    const t = (key) => {
        const langCode = game.i18n.lang || "en";
        return lang[langCode]?.[key] || lang["en"][key] || key;
    };

    const content = `
        <style>
            .wsparcie-dialog {
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 1em;
                border-radius: 8px;
                line-height: 1.5;
            }
            .wsparcie-dialog p {
                margin: 0.75em 0;
            }
            .wsparcie-dialog ul {
                list-style: none;
                padding: 0;
                margin: 0.75em 0;
            }
            .wsparcie-dialog li {
                margin-bottom: 0.5em;
            }
            .wsparcie-dialog a {
                text-decoration: none;
                font-weight: bold;
                color: #f26c4f;
                background: rgba(255, 255, 255, 0.05);
                padding: 0.25em 0.5em;
                border-radius: 4px;
                transition: background 0.2s, color 0.2s;
            }
            .wsparcie-dialog a:hover {
                background: #f26c4f;
                color: #fff;
            }
            .wsparcie-dialog .footer {
                font-size: 0.85em;
                opacity: 0.7;
                margin-top: 1.2em;
                font-style: italic;
            }
            .wsparcie-dialog .emoji {
                background: #4c4c4c;
                color: #fff;
                border-radius: 4px;
                padding: 0 6px;
                font-size: 1em;
                display: inline-block;
                min-width: 1.4em;
                text-align: center;
                box-shadow: 0 0 1px #000;
            }
        </style>

        <div class="wsparcie-dialog">
        <p>${t("Powitanie")}</p>
        <p>${t("Tresc")}</p>
        <ul>
            <li><span class="emoji">🧡</span> <a href="https://patreon.com/Ephaltes" target="_blank">${t("Patreon")}</a></li>
            <li><span class="emoji">☕</span> <a href="https://Ko-fi.com/ephaltes" target="_blank">${t("Kofi")}</a></li>
            <li><span class="emoji">💬</span> <a href="https://discord.gg/gb4UHaAsc4" target="_blank">${t("Discord")}</a></li>
        </ul>
        <p class="footer">${t("Footer")}</p>
        </div>
  `;

    dialogWsparcie = new Dialog({
        title: t("Tytul"),
        content,
        buttons: {
        close: {
            label: t("Zamknij"),
            callback: () => dialogWsparcie = false
        }
        },
        close: () => dialogWsparcie = false
    }).render(true);
}
