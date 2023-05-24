import router from "@girder/core/router";
import events from "@girder/core/events";
import { Layout } from '@girder/core/constants';

import { exposePluginConfig } from "@girder/core/utilities/PluginUtils";

exposePluginConfig("tma_viewer", "plugins/tma_viewer/config");

import TMAView from "./views/body/TMAView";

router.route("TMAView/:folderId", "tmaview", function (folderId, settings) {
    events.trigger("g:navigateTo", TMAView, { folderId: folderId, settings: settings });
});
