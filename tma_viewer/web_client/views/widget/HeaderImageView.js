import { wrap } from "@girder/core/utilities/PluginUtils";
import HeaderImageView from "@girder/histomicsui/views/layout/HeaderImageView";
import _ from "underscore";
import events from "../../events";
import { getParentFolderId } from "../utils/utils";

wrap(HeaderImageView, "initialize", function (initialize) {
    initialize.apply(this, _.rest(arguments));
});

wrap(HeaderImageView, "render", function (render) {
    render.call(this);
    let imageModel;

    if (this.imageModel !== null) {
        getParentFolderId(this.imageModel.attributes.folderId).then((response) => {
            if (response.meta !== undefined && response.meta.type === "tissue_microarray_stain") {
                if (this.$(".h-open-tma-grid").length === 0) {
                    $("[id*=tma-iframe]").attr(
                        "src",
                        `${window.location.origin}/#TMAView/${this.imageModel.attributes.folderId}?isEmpty=true&hightlight=${this.imageModel.attributes._id}`
                    );
                    $( 
                        `<button type="button" class="btn btn-default h-open-tma-grid" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-copy" aria-hidden="true"></span> Open TMA Grid...</button>`
                    ).insertBefore(this.$(".h-open-image"));
                }
            }
        });
    }
});
