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
        type: OptionType.STRING,
        description: "URLs плагинов (по одному на строку)",
        default: "",
    }
});

export default definePlugin({
    name: "RemotePluginLoader",
    description: "Загружает плагины с удалённых URL",
    authors: [Devs.Nobody],
    settings,

    async start() {
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
