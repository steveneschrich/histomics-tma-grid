export const TMADesignMetadataSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
        },
        name: {
            type: "string",
        },
        design: {
            type: "object",
            properties: {
                num_rows: {
                    type: "integer",
                },
                num_cols: {
                    type: "integer",
                },
                layout: {
                    type: "string",
                    enum: ["landscape", "portrait"],
                },
                cores: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: ["string", "integer"],
                            },
                            Description: {
                                type: "string",
                            },
                            row_index: {
                                type: "integer",
                            },
                            col_index: {
                                type: "integer",
                            },
                            is_empty: {
                                type: "boolean",
                            },
                        },
                        required: [
                            "id",
                            "Description",
                            "row_index",
                            "col_index",
                            "is_empty",
                        ],
                    },
                },
            },
            required: ["num_rows", "num_cols", "layout", "cores"],
        },
        core_annotation: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                    },
                    tissue: {
                        type: "string",
                    },
                    diagnosis: {
                        type: "string",
                    },
                    percent_tumor: {
                        type: "string",
                    },
                },
            },
        },
    },
    required: ["type", "name", "design", "core_annotation"],
};
