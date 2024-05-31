// Import Statements
// ----------------------------------------------------------------

// ---
import { ServerResponse, makeServerRequest, encodeURI, parseServerMessage } from "./utils";
// ---

// ----------------------------------------------------------------

// File Docstring
/**
 * Main library file.
 *
 * @author @MaxineToTheStars <https://github.com/MaxineToTheStars>
 */

// Interfaces
export interface VideoInformation {
  videoID: string;
  videoName: string;
  videoOwner: string;
  videoLength: string;
  videoThumbnail: string;
}

// Class Definitions
export class LibreSearch {
  // Enums

  // Interfaces

  // Constants
  private static YOUTUBE_HOSTNAME: string = "www.youtube.com";

  // Public Variables

  // Private Variables

  // Constructor

  // Public Static Methods
  /**
   * Returns a list of YouTube videos based on the search query.
   *
   * @param { string } searchQuery - YouTube search query
   * @returns { Promise<Array<VideoInformation>> } YouTube search results
   */
  public static async search(searchQuery: string): Promise<Array<VideoInformation>> {
    // Call internal implementation
    return this._search(searchQuery);
  }

  // Public Inherited Methods

  // Private Static Methods
  private static async _search(searchQuery: string): Promise<Array<VideoInformation>> {
    // Set HTTPS request options
    const requestOptions: Object = {
      hostname: this.YOUTUBE_HOSTNAME,
      method: "GET",
      path: `/results?search_query=${await encodeURI(searchQuery.trim())}&hl=en`
    }

    // Make an HTTPS request
    const response: ServerResponse = await makeServerRequest(requestOptions);

    // Parse the output data
    return await parseServerMessage(response.convertedBufferArray);
  }

  // Private Inherited Methods
}
