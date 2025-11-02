/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    pluginUrls: {
        type: OptionType.COMPONENT,
        description: "URLs плагинов (по одному на строку)",
        component: () => {
            const [urls, setUrls] = Vencord.Webpack.Common.React.useState(settings.store.pluginUrls || "");
            return Vencord.Webpack.Common.React.createElement("textarea", {
                value: urls,
                onChange: e => {
                    setUrls(e.target.value);
                    settings.store.pluginUrls = e.target.value;
                },
                rows: 5,
                style: { width: "100%", resize: "vertical" }
            });
        }
    }
});

export default definePlugin({
    name: "RemotePluginLoader",
    description: "Загружает плагины с удалённых URL",
    authors: [Devs.Nobody],
    required: true,
    settings,

    async start() {
        // Создаём API для удалённых плагинов
        const { registerRemotePlugin, getRemotePluginSetting } = await import("@components/settings/tabs/RemotePluginsTab");
        
        window.VencordRemotePluginAPI = {
            registerPlugin: registerRemotePlugin,
            getSetting: getRemotePluginSetting
        };
        
        const urls = settings.store.pluginUrls.split("\n").filter(u => u.trim());
        
        for (const url of urls) {
            try {
                const response = await fetch(url.trim());
                const code = await response.text();
                eval(code);
                console.log(`[RemotePluginLoader] Загружен: ${url}`);
            } catch (err) {
                console.error(`[RemotePluginLoader] Ошибка загрузки ${url}:`, err);
            }
        }
    }
});
