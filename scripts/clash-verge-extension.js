/**
 * NUAA campus rules for Clash Verge Rev.
 *
 * This script is idempotent: running it repeatedly replaces the managed
 * provider/group/rule instead of appending another copy. It is therefore safe
 * to use as a global extension script when airport subscriptions are updated.
 */

const SETTINGS = {
  providerName: "campus",
  groupName: "🏫校园服务",
  fallbackGroup: "🚀 节点选择",
  ruleUrl:
    "https://raw.githubusercontent.com/kings669/clash-campus-rules/main/campus.list",
  rulePath: "./ruleset/campus.list",

  // Empty means apply to every profile. To limit it, add exact profile names:
  // profileNames: ["订阅 A", "订阅 B"],
  profileNames: [],
};

function isManagedRule(rule) {
  if (typeof rule !== "string") return false;

  const parts = rule.split(",").map(function (part) {
    return part.trim();
  });

  return parts[0] === "RULE-SET" && parts[1] === SETTINGS.providerName;
}

function shouldApply(profileName) {
  return (
    SETTINGS.profileNames.length === 0 ||
    SETTINGS.profileNames.indexOf(profileName) !== -1
  );
}

function main(config, profileName) {
  if (!config || typeof config !== "object" || !shouldApply(profileName)) {
    return config;
  }

  // 1. Upsert the rule provider. Object assignment cannot create duplicates.
  if (
    !config["rule-providers"] ||
    typeof config["rule-providers"] !== "object" ||
    Array.isArray(config["rule-providers"])
  ) {
    config["rule-providers"] = {};
  }

  config["rule-providers"][SETTINGS.providerName] = {
    type: "http",
    behavior: "domain",
    format: "text",
    interval: 86400,
    path: SETTINGS.rulePath,
    url: SETTINGS.ruleUrl,
  };

  // 2. Remove every old copy of the managed group, then add exactly one.
  const oldGroups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];

  const otherGroups = oldGroups.filter(function (group) {
    return !group || group.name !== SETTINGS.groupName;
  });

  const availableNames = {};
  const proxies = Array.isArray(config.proxies) ? config.proxies : [];

  proxies.forEach(function (proxy) {
    if (proxy && proxy.name) availableNames[proxy.name] = true;
  });
  otherGroups.forEach(function (group) {
    if (group && group.name) availableNames[group.name] = true;
  });

  const campusChoices = ["DIRECT"];
  if (
    SETTINGS.fallbackGroup !== SETTINGS.groupName &&
    availableNames[SETTINGS.fallbackGroup]
  ) {
    campusChoices.push(SETTINGS.fallbackGroup);
  }

  config["proxy-groups"] = [
    {
      name: SETTINGS.groupName,
      type: "select",
      proxies: campusChoices,
    },
  ].concat(otherGroups);

  // 3. Remove old campus rules and prepend exactly one rule.
  const oldRules = Array.isArray(config.rules) ? config.rules : [];
  const otherRules = oldRules.filter(function (rule) {
    return !isManagedRule(rule);
  });

  config.rules = [
    "RULE-SET," + SETTINGS.providerName + "," + SETTINGS.groupName,
  ].concat(otherRules);

  return config;
}
