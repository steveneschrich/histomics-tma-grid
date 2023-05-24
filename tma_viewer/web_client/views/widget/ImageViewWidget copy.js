import { wrap } from "@girder/core/utilities/PluginUtils";
import ImageView from "@girder/histomicsui/views/body/ImageView";
import _ from "underscore";
import events from "../../events";

import "../../stylesheets/panel/TMAPanelWidget.styl";
import "../../stylesheets/panel/FilesPanelWidget.styl";

import TMAPanelWidgetTemplate from "../../templates/panels/TMAPanelWidget.pug";
import FilesPanelWidget from "../../templates/panels/FilesPanelWidget.pug";
import { getTMAData } from "../utils/utils";
import { getFilesPerItem } from "../utils/utils";

wrap(ImageView, "initialize", function (initialize) {
    console.log(this);
    initialize.apply(this, _.rest(arguments));
});

wrap(ImageView, "render", function (render) {
    render.call(this);
    console.log(this.model.attributes);
    const folderId = this.model.attributes.folderId;
    const imageId = this.model.attributes._id;

    getTMAData(folderId, this.model.attributes._id, 20);
    getFilesPerItem(this.model.attributes._id);

    let isOpen = true;

    const panelOpenAndCloseHandler = (panelId) => {
        const contentElement = $(`#${panelId}`);

        const parentElement = contentElement.parent().parent();

        parentElement.find(".s-panel-title-container").click(function () {
            isOpen = !isOpen;

            contentElement.parent().animate({
                height: "toggle",
            });

            if (isOpen) {
                parentElement
                    .find(".s-panel-controls .icon-down-open")
                    .removeClass("icon-down-open", 1000)
                    .addClass("icon-up-open", 1000);
            } else {
                parentElement
                    .find(".s-panel-controls .icon-up-open")
                    .removeClass("icon-up-open", 1000)
                    .addClass("icon-down-open", 1000);
            }
        });
    };

    events.once("query:tma-table-data", function (data) {
        if ($(".tma-panel-table").length === 0) {
            $(".s-panel-group.h-panel-group-right").append(
                TMAPanelWidgetTemplate({
                    items: data.chunks,
                    metadata: data.metadata,
                    orientation: data.orientation,
                })
            );

            panelOpenAndCloseHandler("input-group-tma");
        }
    });

    events.once("query:files-per-tem", function (data) {
        console.log("files", data);
        if ($(".files-group-tma").length === 0) {
            $(".s-panel-group.h-panel-group-right").append(FilesPanelWidget());
            panelOpenAndCloseHandler("files-group-tma");
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
                                src="http://localhost:8080/#TMAView/${folderId}?isEmpty=true&hightlight=${imageId}">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>`);
    }
});

export default ImageView;
