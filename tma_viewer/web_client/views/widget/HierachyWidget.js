import { wrap } from "@girder/core/utilities/PluginUtils";
import HierarchyWidget from "@girder/core/views/widgets/HierarchyWidget";
const _TMA_STAIN_FOLDER_TYPE = "tissue_microarray_stain";

wrap(HierarchyWidget, "render", function (render) {
    render.call(this);

    let folderType = "";

    if (this.parentModel.attributes.meta)
        folderType = this.parentModel.attributes.meta.type;

    if (folderType === _TMA_STAIN_FOLDER_TYPE) {
        const folderId = this.parentModel.attributes._id;
        const folderInfoButton = this.$(".g-folder-info-button");

        if (folderInfoButton.length === 0) {
            return;
        }

        $(
            `<a class="g-tma-grid-button btn btn-sm btn-warning" title="Display TMA Grid"  href="#TMAView/${folderId}" target="_blank"><span class="glyphicon glyphicon-copy" aria-hidden="true"></span></a>`
        ).insertBefore(folderInfoButton);
    }
});
