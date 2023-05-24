import { wrap } from "@girder/core/utilities/PluginUtils";
import HeaderImageView from "@girder/histomicsui/views/layout/HeaderImageView";
import _ from "underscore";

wrap(HeaderImageView, "initialize", function (initialize) {
    initialize.apply(this, _.rest(arguments));
});

wrap(HeaderImageView, "render", function (render) {
    render.call(this);

    if (this.imageModel !== null) {
        $("[id*=tma-iframe]").attr(
            "src",
            `http://localhost:8080/#TMAView/${this.imageModel.attributes.folderId}?isEmpty=true&hightlight=${this.imageModel.attributes._id}`
        );
    }

    $(
        `<button type="button" class="btn btn-default  h-open-tma-grid" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-copy" aria-hidden="true"></span> Open TMA Grid...</button>`
    ).insertBefore(this.$(".h-open-image"));
});
