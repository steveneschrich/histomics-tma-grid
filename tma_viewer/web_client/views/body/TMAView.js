import $ from "jquery";
import View from "@girder/core/views/View";
import events from "../../events";
import tmaTable from "../../templates/tmaTable.pug";
import errorView from "../../templates/error.pug";
import "../../stylesheets/tmaTable.styl";
import { getTMAData } from "../utils/utils";

const TMAView = View.extend({
    initialize(settings) {
        // Hide footer
        $("#g-app-footer-container").hide();

        /**
         *
         * Reviews if the view is inside a modal and will show the navigation menu
         */
        if (settings.settings.isEmpty === "true") {
            $("#g-app-header-container").hide();
            $("#g-global-nav-container").hide();
            $("#g-app-body-container").css("padding", "0px");
            $("#g-app-body-container").css("margin-left", "0px");
        }

        getTMAData(settings.folderId, settings.settings.hightlightId);
        events.once("query:tma-table-data", function (data) {
            if (data.error) {
                $(".g-default-layout").append(
                    errorView({
                        description: data.description,
                        error: data.error,
                    })
                );
            } else {
                $(".g-default-layout").append(
                    tmaTable({
                        items: data.chunks,
                        metadata: data.metadata,
                        orientation: data.layout,
                    })
                );
            }
        });
    },

    render() {},
});

export default TMAView;
