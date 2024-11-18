import $ from "jquery";
import View from "@girder/core/views/View";

import events from "../../events";
import tmaTable from "../../templates/tmaTable.pug";
import errorView from "../../templates/error.pug";
import "../../stylesheets/tmaTable.styl";
import { getTMAData } from "../utils/utils";

/**
 * TMAView is a Girder View that handles the display of TMA data, initializes the view configuration,
 * and manages event handlers for modal dialogs showing metadata.
 * @class
 */
const TMAView = View.extend({
  /**
   * Event handlers within the TMAView.
   * @type {Object.<string, string>}
   * @property {string} "click .show-meta-dialog" - Triggers the `showMetaDialog` method when the `.show-meta-dialog` button is clicked.
   */
  events: {
    "click .show-meta-dialog": "showMetaDialog",
  },

  /**
   * Initializes the TMAView with specified settings, hiding footer and, if applicable, header elements.
   * Fetches TMA data and listens for events to update the display.
   * @param {Object} settings - Settings object containing the configuration for the view.
   * @param {string} settings.folderId - The folder ID where TMA data is located.
   * @param {Object} settings.settings - Additional settings for display customization.
   * @param {string} settings.settings.hightlightId - The ID of the highlighted element.
   * @param {string} settings.settings.isEmpty - Indicator if the view is in a modal and should hide certain UI components.
   */
  initialize(settings) {
    $("#g-app-footer-container").hide();

    /**
         *
         * Check if the view is inside a modal and should hide navigation menus
         */
    if (settings.settings.isEmpty === "true") {
      $("#g-app-header-container").hide();
      $("#g-global-nav-container").hide();
      $("#g-app-body-container").css("padding", "0px");
      $("#g-app-body-container").css("margin-left", "0px");
    }

    // Fetch TMA data based on folderId and highlightId
    getTMAData(settings.folderId, settings.settings.hightlightId);

    /**
     * Listener for the "query:tma-table-data" event to display data or an error message.
     * @event
     * @param {Object} data - Data retrieved from the TMA query.
     * @param {boolean} data.error - Flag indicating if there was an error.
     * @param {string} data.description - Description of the error.
     * @param {Object[]} data.chunks - Array of chunked TMA items.
     * @param {Object} data.metadata - Metadata for the TMA table.
     * @param {string} data.name - Name of the TMA dataset.
     * @param {string} data.layout - Orientation of the TMA data.
     */
    events.once("query:tma-table-data", function(data) {
      if (data.error) {
        $(".g-default-layout").append(
          errorView({
            description: data.description,
            error: data.error,
          }),
        );
      } else {
        $(".g-default-layout").append(
          tmaTable({
            items: data.chunks,
            metadata: data.metadata,
            name: data.name,
            orientation: data.layout,
          }),
        );
      }
    });
  },

  /**
   * Displays a modal dialog with metadata details for the selected TMA item.
   * @param {Event} event - The click event triggered by the `.show-meta-dialog` button.
   */
  showMetaDialog(event) {
    const meta = JSON.parse($(event.currentTarget).attr("data-meta"));
    const detailsHtml = Object.entries(meta)
      .map(
        ([key, value]) =>
          `<p><strong><span style="text-transform: capitalize;">${key}</span>:</strong> ${value}</p>`,
      )
      .join("");

    // Populate and display the modal with metadata details
    $("#metaModalBody").html(detailsHtml);
    $("#metaModal").modal("show");
  },

  /**
   * Renders the TMAView. Currently a placeholder method.
   */
  render() {},
});

export default TMAView;
