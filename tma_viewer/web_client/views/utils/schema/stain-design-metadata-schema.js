export const StainDesignMetadataSchema = {
    type: "object",
    properties: {
        type: {
            type: "string",
        },
        stain: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                },
                description: {
                    type: "string",
                },
            },
            required: ["name", "description"],
        },
        visualization: {
            type: "object",
            properties: {
                layout: {
                    type: "string",
                    enum: ["landscape", "portrait"],
                },
            },
            required: ["layout"],
        },
        tissue_microarray: {
            type: "object",
            properties: {
                cores: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: {
                                type: "integer",
                            },
                            image: {
                                type: "string",
                            },
                        },
                        required: ["id", "image"],
                    },
                },
            },
            required: ["cores"],
        },
    },
    required: ["type", "stain", "tissue_microarray"],
};
