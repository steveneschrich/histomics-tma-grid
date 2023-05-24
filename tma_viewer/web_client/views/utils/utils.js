import { restRequest } from "@girder/core/rest";
import events from "../../events";
import { StainDesignMetadataSchema } from "./schema/stain-design-metadata-schema";
import { TMADesignMetadataSchema } from "./schema/tma-design-metadata-schema";

const ZSchema = require("z-schema");
const validator = new ZSchema();

const TMA_METADATA_FILE_NAME = "tma-metadata.json";
const STAIN_METADATA_FILE_NAME = "stain-metadata.json";
const PORTRAIT_LAYOUT = "portrait";

/**
 *
 * Function to get tissuePosition
 * @param {*} tissueName
 * @return {*}
 */
const getTissuePositionInName = (tissueName) => {
    const tissuePositionString = tissueName.split(".")[0];
    return parseInt(
        tissuePositionString.charAt(tissuePositionString.length - 4)
    );
};

/**
 *
 * Function to split an array into chunks given the position.
 * @param {*} arr
 * @param {*} n
 * @return {*}
 */
const groupByPositionInName = (array) => {
    const unique = Array.from(
        new Set(array.map((item) => getTissuePositionInName(item.name)))
    );
    const result = [];
    unique.forEach((item) => {
        result.push(
            array.filter(
                (e) => getTissuePositionInName(e.name) === parseInt(item)
            )
        );
    });
    return result;
};

/**
 *
 * Transpose an array (swap rows and columns)
 * @param {*} array
 * @return {*} swapped array
 */
const transpose = (array) => {
    return Object.keys(array[0]).map((c) => {
        return array.map((r) => {
            return r[c] !== undefined ? r[c] : [];
        });
    });
};

/**
 * API call to get the list of TMAs images inside the folder
 * @returns Promise to be resolved with the
 */
const getItemsUsingFolderId = (folderId) => {
    return restRequest({
        url: `item?folderId=${folderId}&limit=100&offset=0&sort=name&sortdir=1`,
    });
};

/**
 *
 * API call to get the id of the parent folder
 * @return {*}
 */
const getParentFolderId = (folderId) => {
    return restRequest({
        url: `folder/${folderId}`,
    });
};

/**
 *
 * API call to get the item id related with the TMA json structure located in the base folder
 * @param {*} parentId
 * @return {*}
 */
const getTMASTructureJSONItemId = (parentId, fileName) => {
    return restRequest({
        url: `item?folderId=${parentId}&name=${fileName}&limit=50&sort=name&sortdir=1`,
    });
};

/**
 *
 * API call to get the content of the item with the json structure
 * @param {*} itemId
 * @return {*}
 */
const getTMAStructureJSONContent = (itemId) => {
    return restRequest({
        url: `item/${itemId}/download?contentDisposition=inline`,
    });
};

/**
 *
 * Function to get the list of TMAs images inside the folder and render the template
 * @return {*} Promise void
 */
export const getTMAData = (folderId, hightlightId, imageSize = 150) => {
    if (!folderId) return;
    return getParentFolderId(folderId)
        .then((folder) => {
            return folder.parentId;
        })
        .then((parentId) => {
            return Promise.all([
                getTMASTructureJSONItemId(parentId, TMA_METADATA_FILE_NAME),
                getTMASTructureJSONItemId(folderId, STAIN_METADATA_FILE_NAME),
            ]);
        })
        .then((itemResult) => {
            if (itemResult[0].length === 0) {
                events.trigger("query:tma-table-data", {
                    description: "The TMA Metadata JSON File has errors",
                    error: `Please create a ${TMA_METADATA_FILE_NAME} file first`,
                });
                return;
            }

            if (itemResult[1].length === 0) {
                events.trigger("query:tma-table-data", {
                    description: "The STAIN Metadata JSON File has errors",
                    error: `Please create a ${STAIN_METADATA_FILE_NAME} file first`,
                });
                return;
            }

            return {
                TMAMetadataJSONStructureItemId: itemResult[0][0]._id,
                STAINMetadataJSONStructure: itemResult[1][0]._id,
            };
        })
        .then((itemsId) => {
            return Promise.all([
                getTMAStructureJSONContent(
                    itemsId.TMAMetadataJSONStructureItemId
                ),
                getTMAStructureJSONContent(itemsId.STAINMetadataJSONStructure),
            ]);
        })
        .then((JSONcontent) => {
            const TMAMetadataJSONStructure = JSONcontent[0];
            const STAINMetadataJSONStructure = JSONcontent[1];

            const isTMAMetadataJSONValid = validator.validate(
                TMAMetadataJSONStructure,
                TMADesignMetadataSchema
            );

            if (!isTMAMetadataJSONValid) {
                events.trigger("query:tma-table-data", {
                    description: "The TMA Metadata JSON File has errors",
                    error: `${JSON.stringify(validator.getLastErrors())}`,
                });
                return;
            }

            if (
                parseInt(TMAMetadataJSONStructure.design.num_rows) *
                    parseInt(TMAMetadataJSONStructure.design.num_cols) !==
                TMAMetadataJSONStructure.design.cores.length
            ) {
                events.trigger("query:tma-table-data", {
                    description:
                        "The TMA Metadata JSON File has errors: The number of rows/columns is not equal to the lenght of the cores",
                    error: `Rows count: ${TMAMetadataJSONStructure.design.num_rows}
                            Columns count: ${TMAMetadataJSONStructure.design.num_cols}
                            Core Lenght: ${TMAMetadataJSONStructure.design.cores.length}`,
                });
                return;
            }

            const isStainMetadataJSONValid = validator.validate(
                STAINMetadataJSONStructure,
                StainDesignMetadataSchema
            );

            if (!isStainMetadataJSONValid) {
                events.trigger("query:tma-table-data", {
                    description: "The Stain Metadata JSON File has errors",
                    error: `${JSON.stringify(validator.getLastErrors())}`,
                });
                return;
            }

            const blankCount = TMAMetadataJSONStructure.design.cores.filter(
                (item) => item.is_empty === true
            ).length;

            if (
                TMAMetadataJSONStructure.design.cores.length !==
                STAINMetadataJSONStructure.tissue_microarray.cores.length +
                    blankCount
            ) {
                events.trigger("query:tma-table-data", {
                    description: `The Stain Metadata JSON File has errors: The number of cores in the design is not equal to the number of the in the stain
                        - Not counting the blank cores -`,
                    error: `
                    TMA Cores count: ${
                        TMAMetadataJSONStructure.design.cores.length -
                        blankCount
                    }
                    Core Lenght: ${
                        STAINMetadataJSONStructure.tissue_microarray.cores
                            .length
                    }`,
                });
                return;
            }

            getItemsUsingFolderId(folderId).then((folderItems) => {
                Promise.all(
                    folderItems.map((item) => {
                        return {
                            id: item._id,
                            name: item.name,
                            meta: item.meta,
                            histomicsUrl: `histomics#?image=${item._id}`,
                            thumbnail: `api/v1/item/${item._id}/tiles/thumbnail?width=${imageSize}&height=${imageSize}`,
                            isHightlighted:
                                hightlightId !== undefined &&
                                hightlightId === item._id,
                        };
                    })
                ).then((tmaItems) => {
                    let resultingMatrix = Array(
                        parseInt(TMAMetadataJSONStructure.design.num_rows)
                    )
                        .fill()
                        .map(() =>
                            Array(
                                parseInt(
                                    TMAMetadataJSONStructure.design.num_cols
                                )
                            ).fill()
                        );

                    const currentTMACores =
                        STAINMetadataJSONStructure.tissue_microarray.cores;
                    const designTMACores =
                        TMAMetadataJSONStructure.design.cores;

                    const blankCores = designTMACores.filter(
                        (item) => item.is_empty === true
                    );

                    blankCores.forEach((blankCore) => {
                        resultingMatrix[parseInt(blankCore.row_index) - 1][
                            parseInt(blankCore.col_index) - 1
                        ] = { name: blankCore.id };
                    });

                    tmaItems.forEach((item) => {
                        const selectedCore = currentTMACores.find(
                            (core) => core.image === item.name
                        );

                        if (selectedCore) {
                            const designCore = designTMACores.find(
                                (core) => core.id === selectedCore.id
                            );

                            const coreAnnotation =
                                TMAMetadataJSONStructure.core_annotation.find(
                                    (core) => core.id === designCore.id
                                );

                            item.core_id = designCore.id;
                            item.tissue = coreAnnotation.tissue;
                            item.diagnosis = coreAnnotation.diagnosis;
                            item.percent_tumor = coreAnnotation.percent_tumor;

                            resultingMatrix[parseInt(designCore.row_index) - 1][
                                parseInt(designCore.col_index) - 1
                            ] = item;
                        }
                    });

                    // const sortedItems = tmaItems.sort((a, b) =>
                    //     a.name.localeCompare(b.name)
                    // );

                    // const chunksByName = groupByPositionInName(sortedItems);

                    const currentLayout =
                        STAINMetadataJSONStructure.visualization
                            ? STAINMetadataJSONStructure.visualization.layout
                            : TMAMetadataJSONStructure.design.layout;

                    const actualChunks =
                        currentLayout === PORTRAIT_LAYOUT
                            ? transpose(resultingMatrix)
                            : resultingMatrix;

                    const result = {
                        chunks: actualChunks,
                        metadata: STAINMetadataJSONStructure,
                        layout: TMAMetadataJSONStructure.design.layout,
                    };

                    events.trigger("query:tma-table-data", result);
                    return result;
                });
            });
        });
};

/**
 *
 * Function to get the list of files per item
 * @param itemId ID of the item
 * @return {*} Promise void
 */
export const getFilesPerItem = (itemId) => {
    if (!itemId) return;
    restRequest({
        url: `item/${itemId}/files?limit=101&offset=0&sort=name&sortdir=1`,
    }).then((data) => {
        events.trigger("query:files-per-key", data);
        return data;
    });
};
