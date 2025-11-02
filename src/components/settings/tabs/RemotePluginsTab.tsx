/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Forms, React, Switch, TextInput } from "@webpack/common";

interface RemotePluginConfig {
    name: string;
    settings: Record<string, {
        type: "string" | "number" | "boolean";
        label: string;
        description?: string;
        default: any;
    }>;
}

export const remotePluginConfigs: RemotePluginConfig[] = [];

export function registerRemotePlugin(config: RemotePluginConfig) {
    remotePluginConfigs.push(config);
}

function getStoredSettings() {
    try {
        return JSON.parse(localStorage.getItem("VencordRemotePluginSettings") || "{}");
    } catch {
        return {};
    }
}

function saveSettings(settings: any) {
    localStorage.setItem("VencordRemotePluginSettings", JSON.stringify(settings));
}

export function getRemotePluginSetting(pluginName: string, key: string, defaultValue: any) {
    const settings = getStoredSettings();
    return settings[pluginName]?.[key] ?? defaultValue;
}

export default function RemotePluginsTab() {
    const [settings, setSettings] = React.useState(getStoredSettings());
    const [expandedPlugins, setExpandedPlugins] = React.useState<Set<string>>(new Set());

    const updateSetting = (pluginName: string, key: string, value: any) => {
        const newSettings = {
            ...settings,
            [pluginName]: { ...settings[pluginName], [key]: value }
        };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const togglePlugin = (pluginName: string) => {
        const newExpanded = new Set(expandedPlugins);
        if (newExpanded.has(pluginName)) {
            newExpanded.delete(pluginName);
        } else {
            newExpanded.add(pluginName);
        }
        setExpandedPlugins(newExpanded);
    };

    return (
        <div style={{ padding: "16px" }}>
            <Forms.FormTitle tag="h3">Custom Plugin Settings</Forms.FormTitle>
            <Forms.FormText>Настройки для кастомных плагинов</Forms.FormText>
            
            {remotePluginConfigs.length === 0 ? (
                <Forms.FormText style={{ marginTop: "20px", fontStyle: "italic" }}>
                    Нет загруженных плагинов с настройками
                </Forms.FormText>
            ) : (
                remotePluginConfigs.map(plugin => (
                    <div key={plugin.name} style={{ marginTop: "20px" }}>
                        <Forms.FormDivider />
                        <div 
                            onClick={() => togglePlugin(plugin.name)}
                            style={{ 
                                cursor: "pointer", 
                                padding: "12px",
                                background: "var(--background-secondary)",
                                borderRadius: "4px",
                                marginTop: "8px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                        >
                            <Forms.FormTitle tag="h5" style={{ margin: 0 }}>{plugin.name}</Forms.FormTitle>
                            <span>{expandedPlugins.has(plugin.name) ? "▼" : "▶"}</span>
                        </div>
                        
                        {expandedPlugins.has(plugin.name) && (
                            <div style={{ marginTop: "12px", paddingLeft: "16px" }}>
                                {Object.entries(plugin.settings).map(([key, config]) => (
                                    <div key={key} style={{ marginTop: "12px" }}>
                                        <Forms.FormTitle>{config.label}</Forms.FormTitle>
                                        {config.description && (
                                            <Forms.FormText style={{ marginBottom: "8px" }}>{config.description}</Forms.FormText>
                                        )}
                                        
                                        {config.type === "string" && (
                                            <TextInput
                                                value={settings[plugin.name]?.[key] ?? config.default}
                                                onChange={(val: string) => updateSetting(plugin.name, key, val)}
                                            />
                                        )}
                                        
                                        {config.type === "number" && (
                                            <TextInput
                                                type="number"
                                                value={settings[plugin.name]?.[key] ?? config.default}
                                                onChange={(val: string) => updateSetting(plugin.name, key, Number(val))}
                                            />
                                        )}
                                        
                                        {config.type === "boolean" && (
                                            <Switch
                                                value={settings[plugin.name]?.[key] ?? config.default}
                                                onChange={(val: boolean) => updateSetting(plugin.name, key, val)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
