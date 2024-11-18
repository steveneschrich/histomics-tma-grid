export const TMADesignMetadataSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["tissue_microarray"],
    },
    name: {
      type: "string",
    },
    design: {
      type: "object",
      properties: {
        num_rows: {
          type: "integer",
          minimum: 1,
        },
        num_cols: {
          type: "integer",
          minimum: 1,
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
              study_core_id: {
                type: "string",
              },
              core_id: {
                oneOf: [{ type: "string" }, { type: "integer" }],
              },
              core_label: {
                oneOf: [{ type: "string" }, { type: "integer" }],
              },
              tma_number: {
                type: "integer",
                minimum: 1,
              },
              row_index: {
                type: "integer",
                minimum: 1,
              },
              row_label: {
                type: "string",
              },
              col_index: {
                type: "integer",
                minimum: 1,
              },
              col_label: {
                oneOf: [{ type: "string" }, { type: "integer" }],
              },
              is_empty: {
                type: "boolean",
              },
              core_annotations: {
                type: "object",
                additionalProperties: {
                  type: ["string", "number", "boolean", "null"],
                },
              },
            },
            required: [
              "study_core_id",
              "core_id",
              "tma_number",
              "row_index",
              "row_label",
              "col_index",
              "col_label",
              "is_empty",
            ],
          },
        },
      },
      required: ["num_rows", "num_cols", "layout", "cores"],
    },
  },
  required: ["type", "name", "design"],
};
