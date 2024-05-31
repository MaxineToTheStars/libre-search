// Import Statements
// ----------------------------------------------------------------
import { request } from "node:https";
import { escape } from "node:querystring";
import { IncomingMessage } from "node:http";
// ---
import { VideoInformation } from "lib";
// ---

// ----------------------------------------------------------------

// File Docstring
/**
 * Utility functions for libre-search.
 *
 * @author @MaxineToTheStars <https://github.com/MaxineToTheStars>
 */

// Enums

// Interfaces
export interface ServerResponse {
  statusCode: number;
  // rawBufferArray: Array<Buffer>;
  convertedBufferArray: string;
}

// Constants

// Public Variables

// Private Variables

// Main

// Public Methods
/**
 * Makes an HTTPS request to YouTube with the provided ``options``.
 *
 * @param { Object } requestOptions - Request options
 * @returns { Promise<ServerResponse> } A ServerResponse object
 * @see https://nodejs.org/api/http.html#httprequestoptions-callback
 */
export async function makeServerRequest(requestOptions: Object): Promise<ServerResponse> {
  // Return a new Promise
  return new Promise((resolve, reject) => {
    // Execute the HTTPS request
    request(requestOptions, (response: IncomingMessage) => {
      // Create a new empty string buffer
      let rawStringBuffer: string = new String().toString();

      // Handle 4XX errors
      if (response.statusCode !== undefined && response.statusCode >= 400 && response.statusCode < 500) {
        reject({
          statusCode: response.statusCode,
          // rawBufferArray: new Array<Buffer>(),
          convertedBufferArray: new String().toString(),
        });
      }

      // Handle any streaming errors
      response.on("error", (_: Error) => {
        reject({
          statusCode: -1,
          // rawBufferArray: new Array<Buffer>(),
          convertedBufferArray: new String().toString(),
        });
      });

      // Handle chunk streaming
      response.on("data", (chunk: Buffer) => {
        // Push the new chunk into the rawStringBuffer
        rawStringBuffer += chunk.toString("utf-8");
      });

      // Handle the closing of the stream
      response.on("end", () => {
        resolve({
          statusCode: response.statusCode || 200,
          // rawBufferArray: buffer,
          convertedBufferArray: rawStringBuffer
        });
      });
    }).end();
  });
}

/**
 * Encodes the given text with the RFC 3986 URI Generic Syntax.
 *
 * @param { string } text - The text to encode
 * @returns { Promise<string> } Newly encoded URI
 * @see https://datatracker.ietf.org/doc/html/rfc3986
 */
export async function encodeURI(text: string): Promise<string> {
  // Return a new Promise
  return new Promise((resolve, _) => {
    resolve(encodeURIComponent(text).replace(/[!'()*]/g, escape));
  });
}

/**
 * Parses the ``ServerResponse`` sent by YouTube to pull the video ID and some basic metadata.
 *
 * @param { string } data - The response sent by YouTube
 * @returns { Promise<Array<VideoInformation>> } An array of VideoInformation objects
 */
export async function parseServerMessage(data: string): Promise<Array<VideoInformation>> {

  // Instance a new VideoInformation array
  const videoInformationArray: Array<VideoInformation> = new Array<VideoInformation>();

  // Get the start and end indexes
  const startIndex: number = data.indexOf("var ytInitialData") + 20;
  const endIndex: number = data.indexOf("</script>", startIndex) - 1;

  // Extract the JSON context
  const rawJSONResponse: any = JSON.parse(data.substring(startIndex, endIndex));

  // Extract the content array
  const contentArray: Array<Object> = rawJSONResponse.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;

  // Loop through the array
  for (let i = 0; i < contentArray.length; i++) {
    // Assume each object is a videoRenderer
    try {
      // Set the current index
      const currentIndex: any = contentArray[i];

      // Extract the video data
      const videoID: string = currentIndex.videoRenderer.videoId;
      const videoName: string = currentIndex.videoRenderer.title.runs[0].text;
      const videoOwner: string = currentIndex.videoRenderer.longBylineText.runs[0].text;
      const videoLength: string = currentIndex.videoRenderer.lengthText.simpleText;
      const videoThumbnail: string = currentIndex.videoRenderer.thumbnail.thumbnails[1].url;

      // Push to array
      videoInformationArray.push({ videoID: videoID, videoName: videoName, videoOwner: videoOwner, videoLength: videoLength, videoThumbnail: videoThumbnail, });

    } catch (error) {
      // Not a videoRenderer tag
      continue;
    }
  }

  // Return the new array
  return videoInformationArray;
}

// Private Methods
