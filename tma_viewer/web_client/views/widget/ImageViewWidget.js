import { wrap } from "@girder/core/utilities/PluginUtils";
import ImageView from "@girder/histomicsui/views/body/ImageView";
import _ from "underscore";
import events from "../../events";

import "../../stylesheets/panel/TMAPanelWidget.styl";
import errorView from "../../templates/error.pug";

import TMAPanelWidgetTemplate from "../../templates/panels/TMAPanelWidget.pug";
import { getTMAData } from "../utils/utils";

wrap(ImageView, "initialize", function (initialize) {
    initialize.apply(this, _.rest(arguments));
});

wrap(ImageView, "render", function (render) {
    render.call(this);
    const folderId = this.model.attributes.folderId;
    const imageId = this.model.attributes._id;
    const HORIZONTAL = "horizontal";

    getTMAData(folderId, this.model.attributes._id, 20);

    const panelOpenAndCloseHandler = (panelId, isHorizontal = false) => {
        const contentElement = $(`#${panelId}`);
        const parentElement = contentElement.parent().parent();

        parentElement.find(".s-panel-title-container").on("click", function () {
            contentElement.parent().animate({
                height: "toggle",
            });

            parentElement
                .find(".s-panel-controls i")
                .toggleClass("icon-up-open", 1000)
                .toggleClass("icon-down-open", 1000);

            if (isHorizontal) {
                parentElement.toggleClass("horizontal-panel", 1000);
                if (parentElement.hasClass("horizontal-panel")) {
                    parentElement.css({
                        "margin-left": `-${contentElement.height()}px`,
                    });
                } else {
                    parentElement.css({
                        "margin-left": `0`,
                    });
                }
            }
        });
    };

    events.once("query:tma-table-data", function (data) {
        const panelId = "input-group-tma";

        if ($(".tma-panel-table").length === 0) {
            if (data.error && $(".g-tma-error-label").length === 0) {
                console.log("APPENDING");
                $(".s-panel-group.h-panel-group-right").append(
                    errorView({
                        description: data.description,
                        error: data.error,
                    })
                );
            } else {
                $(".s-panel-group.h-panel-group-right").append(
                    TMAPanelWidgetTemplate({
                        items: data.chunks,
                        metadata: data.metadata,
                        orientation: data.orientation,
                    })
                );

                const contentElement = $(`#${panelId}`);

                const parentElement = contentElement.parent().parent();
                if (data.orientation === HORIZONTAL) {
                    parentElement.addClass("horizontal-panel");
                    parentElement.css({
                        "margin-left": `-${contentElement.height()}px`,
                    });
                }

                panelOpenAndCloseHandler(
                    panelId,
                    data.orientation === HORIZONTAL
                );
            }
        }
    });

    if (folderId !== undefined) {
        $("body").append(`
            <div class="modal fade modal-xl" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="myModal" aria-hidden="true">
                <div class="modal-dialog modal-lg" style="height: 800px; width: 80%">
                    <div class="modal-content">
                        <div class="embed-responsive embed-responsive-16by9">
                            <iframe
                                id="tma-iframe"
                                class="embed-responsive-item" 
                                src="${window.location.origin}/#TMAView/${folderId}?isEmpty=true&hightlight=${imageId}">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>`);
    }
});

export default ImageView;
