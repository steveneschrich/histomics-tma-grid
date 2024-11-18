export const StainDesignMetadataSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      study_core_id: {
        type: "string",
      },
      image: {
        type: "string",
      },
    },
    required: ["study_core_id", "image"],
  },
};
