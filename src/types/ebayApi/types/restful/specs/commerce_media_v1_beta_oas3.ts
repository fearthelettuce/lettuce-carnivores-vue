/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/video": {
    /** @description This method creates a video. When using this method, specify the <b>title</b>, <b>size</b>, and <b>classification</b> of the video to be created. <b>Description</b> is an optional field for this method.<br /><br /><span class="tablenote"><span style="color:#478415"><strong>Tip:</strong></span> See <a href="https://www.ebay.com/help/selling/listings/creating-managing-listings/add-video-to-listing?id=5272#section3" target="_blank">Adding a video to your listing</a> in the eBay Seller Center for details about video formatting requirements and restrictions, or visit the relevant eBay site help pages for the region in which the listings will be posted.</span><br /><br />When a video is successfully created, the method returns the HTTP Status Code <code>201 Created.</code>The method also returns the location response header containing the <b>video ID</b>, which you can use to retrieve the video.<br /><br /><span class="tablenote"><span style="color:#004680"><strong>Note:</strong></span> There is no ability to edit metadata on videos at this time. There is also no method to delete videos.</span><br /><br />To upload a created video, use the <a href=" /api-docs/commerce/media/resources/video/methods/uploadVideo" target="_blank">uploadVideo</a> method. */
    post: operations["createVideo"];
  };
  "/video/{video_id}": {
    /** @description This method retrieves a video's metadata and content given a specified <b>video ID</b>. The method returns the <b>title</b>, <b>size</b>, <b>classification</b>, <b>description</b>, <b>video ID</b>, <b>playList</b>, <b>status</b>, <b>status message</b> (if any), <b>expiration  date</b>, and <b>thumbnail</b> image of the retrieved video. <p>The video’s <b>title</b>, <b>size</b>, <b>classification</b>, and <b>description</b> are set using the <a href=" /api-docs/commerce/media/resources/video/methods/createVideo" target="_blank">createVideo</a> method.</p> <p>The video's <b>playList</b> contains two URLs that link to instances of the streaming video based on the supported protocol.</p><p>The <b>status</b> field contains the current status of the video. After a video upload is successfully completed, the video's <b>status</b> will show as <code>PROCESSING</code> until the video reaches one of the terminal states of <code>LIVE</code>, <code>BLOCKED</code> or <code>PROCESSING_FAILED</code>.<p> If a video's processing fails, it could be because the file is corrupted, is too large, or its size doesn’t match what was provided in the metadata. Refer to the error messages to determine the cause of the video’s failure to upload.</p> <p> The <b>status message</b> will indicate why a video was blocked from uploading.</p><p>The video’s <b>expiration date</b> is automatically set to 365 days (one year) after the video’s initial creation.<p>The video's <b>thumbnail</b> image is automatically generated when the video is created. */
    get: operations["getVideo"];
  };
  "/video/{video_id}/upload": {
    /** @description This method associates the specified file with the specified <b>video ID</b> and uploads the input file. After the file has been uploaded the processing of the file begins.<br /><br /><span class="tablenote"><span style="color:#004680"><strong>Note:</strong></span> The size of the video to be uploaded must exactly match the size of the video's input stream that was set in the <a href=" /api-docs/commerce/media/resources/video/methods/createVideo" target="_blank">createVideo</a> method. If the sizes do not match, the video will not upload successfully.</span><br /><br />When a video is successfully uploaded, it returns the HTTP Status Code <code>200 OK</code>.<br /><br />The status flow is <code>PENDING_UPLOAD</code> > <code>PROCESSING</code> > <code>LIVE</code>,  <code>PROCESSING_FAILED</code>, or <code>BLOCKED</code>. After a video upload is successfully completed, the status will show as <code>PROCESSING</code> until the video reaches one of the terminal states of <code>LIVE</code>, <code>BLOCKED</code>, or <code>PROCESSING_FAILED</code>. If the size information (in bytes) provided is incorrect, the API will throw an error.<br /><br /><span class="tablenote"><span style="color:#478415"><strong>Tip:</strong></span> See <a href="https://www.ebay.com/help/selling/listings/creating-managing-listings/add-video-to-listing?id=5272#section3" target="_blank">Adding a video to your listing</a> in the eBay Seller Center for details about video formatting requirements and restrictions, or visit the relevant eBay site help pages for the region in which the listings will be posted.</span><br /><br />To retrieve an uploaded video, use the <a href="/api-docs/commerce/media/resources/video/methods/getVideo" target="_blank">getVideo</a> method. */
    post: operations["uploadVideo"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /** @description The request to create a video, which must contain the video's <b>title</b>, <b>size</b>, and <b>classification</b>. <b>Description</b> is an optional field when creating videos. */
    CreateVideoRequest: {
      /** @description The intended use for this video content. Currently, videos can only be added and associated with eBay listings, so the only supported value is <code>ITEM</code>. */
      classification?: (string)[];
      /** @description The description of the video. */
      description?: string;
      /**
       * Format: int32 
       * @description The size, in bytes, of the video content. <br><br><b>Max:</b> 157,286,400 bytes
       */
      size?: number;
      /** @description The title of the video. */
      title?: string;
    };
    /** @description This type defines the fields that can be returned in an error. */
    Error: {
      /** @description Identifies the type of erro. */
      category?: string;
      /** @description Name for the primary system where the error occurred. This is relevant for application errors. */
      domain?: string;
      /**
       * Format: int32 
       * @description A unique number to identify the error.
       */
      errorId?: number;
      /** @description An array of request elements most closely associated to the error. */
      inputRefIds?: (string)[];
      /** @description A more detailed explanation of the error. */
      longMessage?: string;
      /** @description Information on how to correct the problem, in the end user's terms and language where applicable. */
      message?: string;
      /** @description An array of request elements most closely associated to the error. */
      outputRefIds?: (string)[];
      /** @description An array of name/value pairs that describe details the error condition. These are useful when multiple errors are returned. */
      parameters?: (components["schemas"]["ErrorParameter"])[];
      /** @description Further helps indicate which subsystem the error is coming from. System subcategories include: Initialization, Serialization, Security, Monitoring, Rate Limiting, etc. */
      subdomain?: string;
    };
    ErrorParameter: {
      /** @description The object of the error. */
      name?: string;
      /** @description The value of the object. */
      value?: string;
    };
    /** @description The automatically generated thumbnail image of the video. */
    Image: {
      /** @description The URL to access this image. */
      imageUrl?: string;
    };
    /** @description The streaming input of the video source. The input source must be an .mp4 file of the type MPEG-4 Part 10 or Advanced Video Coding (MPEG-4 AVC). */
    InputStream: Record<string, never>;
    /** @description A container that provides video moderation information when calling the <strong>getVideo</strong> method.<br /><br />This container is returned if the specified video has been blocked by moderators.<br /><br /><span class="tablenote"><span style="color:#478415"><strong>Tip:</strong></span> See <a href="https://www.ebay.com/help/selling/listings/creating-managing-listings/add-video-to-listing?id=5272#section2" target="_blank">Video moderation and restrictions</a> in the eBay Seller Center for details about video moderation.</span> */
    Moderation: {
      /** @description The reason(s) why the specified video was blocked by moderators. */
      rejectReasons?: (string)[];
    };
    /** @description The two streaming video URLs available for a successfully uploaded video with a status of <code>LIVE</code>. The supported streaming video protocols are DASH (Dynamic Adaptive Streaming over HTTP) and HLS (HTTP Live Streaming). */
    Play: {
      /** @description The playable URL for this video. */
      playUrl?: string;
      /** @description The protocol for the video playlist. Supported protocols are DASH (Dynamic Adaptive Streaming over HTTP) and HLS (HTTP Live Streaming). For implementation help, refer to <a href='https://developer.ebay.com/api-docs/commerce/media/types/api:ProtocolEnum'>eBay API documentation</a> */
      protocol?: string;
    };
    /** @description A response field that retrieves all the metadata for the video, including its <b>title</b>, <b>classification</b>, <b>size</b>, <b>description</b>, <b>status</b>, <b>status message</b> (if any), and <b>expiration date</b>. */
    Video: {
      /** @description The intended use for this video content. Currently, videos can only be added and associated with eBay listings, so the only supported value is <code>ITEM</code>. */
      classification?: (string)[];
      /** @description The description of the video. The video description is an optional field that can be set using the <a href=" /api-docs/commerce/media/resources/video/methods/createVideo" target="_blank">createVideo</a> method. */
      description?: string;
      /** @description The expiration date of the video in Coordinated Universal Time (UTC). The video’s expiration date is automatically set to 365 days (one year) after the video’s initial upload. */
      expirationDate?: string;
      /** @description The video moderation information that is returned if a video is blocked by moderators.<br /><br /><span class="tablenote"><span style="color:#478415"><strong>Tip:</strong></span> See <a href="https://www.ebay.com/help/selling/listings/creating-managing-listings/add-video-to-listing?id=5272#section2" target="_blank">Video moderation and restrictions</a> in the eBay Seller Center for details about video moderation.</span><br /><br />If the video status is <code>BLOCKED</code>, ensure that the video complies with eBay's video formatting and content guidelines. Afterwards, begin the video creation and upload procedure anew using the <strong>createVideo</strong> and <strong>uploadVideo</strong> methods. */
      moderation?: components["schemas"]["Moderation"];
      /** @description The playlist created for the uploaded video, which provides the streaming video URLs to play the video. The supported streaming video protocols are DASH (Dynamic Adaptive Streaming over HTTP) and HLS (HTTP Live Streaming). The playlist will only be generated if a video is successfully uploaded with a status of <code>LIVE</code>. */
      playLists?: (components["schemas"]["Play"])[];
      /**
       * Format: int32 
       * @description The size, in bytes, of the video content.
       */
      size?: number;
      /** @description The status of the current video resource. For implementation help, refer to <a href='https://developer.ebay.com/api-docs/commerce/media/types/api:VideoStatusEnum'>eBay API documentation</a> */
      status?: string;
      /** @description The <b>statusMessage</b> field contains additional information on the status. For example, information on why processing might have failed or if the video was blocked. */
      statusMessage?: string;
      /** @description The URL of the thumbnail image of the video. The thumbnail image's URL must be an eBayPictureURL (EPS URL). */
      thumbnail?: components["schemas"]["Image"];
      /** @description The title of the video. */
      title?: string;
      /** @description The unique ID of the video. */
      videoId?: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export interface operations {

  /** @description This method creates a video. When using this method, specify the <b>title</b>, <b>size</b>, and <b>classification</b> of the video to be created. <b>Description</b> is an optional field for this method.<br /><br /><span class="tablenote"><span style="color:#478415"><strong>Tip:</strong></span> See <a href="https://www.ebay.com/help/selling/listings/creating-managing-listings/add-video-to-listing?id=5272#section3" target="_blank">Adding a video to your listing</a> in the eBay Seller Center for details about video formatting requirements and restrictions, or visit the relevant eBay site help pages for the region in which the listings will be posted.</span><br /><br />When a video is successfully created, the method returns the HTTP Status Code <code>201 Created.</code>The method also returns the location response header containing the <b>video ID</b>, which you can use to retrieve the video.<br /><br /><span class="tablenote"><span style="color:#004680"><strong>Note:</strong></span> There is no ability to edit metadata on videos at this time. There is also no method to delete videos.</span><br /><br />To upload a created video, use the <a href=" /api-docs/commerce/media/resources/video/methods/uploadVideo" target="_blank">uploadVideo</a> method. */
  createVideo: {
    parameters: {
      header: {
        /** @description This header indicates the format of the request body provided by the client. Its value should be set to <b>application/json</b>. <br><br> For more information, refer to <a href="/api-docs/static/rest-request-components.html#HTTP" target="_blank ">HTTP request headers</a>. */
        "Content-Type": string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["CreateVideoRequest"];
      };
    };
    responses: {
      /** @description Created */
      201: never;
      /** @description Bad Request */
      400: never;
      /** @description Forbidden */
      403: never;
      /** @description Internal Server Error */
      500: never;
    };
  };
  /** @description This method retrieves a video's metadata and content given a specified <b>video ID</b>. The method returns the <b>title</b>, <b>size</b>, <b>classification</b>, <b>description</b>, <b>video ID</b>, <b>playList</b>, <b>status</b>, <b>status message</b> (if any), <b>expiration  date</b>, and <b>thumbnail</b> image of the retrieved video. <p>The video’s <b>title</b>, <b>size</b>, <b>classification</b>, and <b>description</b> are set using the <a href=" /api-docs/commerce/media/resources/video/methods/createVideo" target="_blank">createVideo</a> method.</p> <p>The video's <b>playList</b> contains two URLs that link to instances of the streaming video based on the supported protocol.</p><p>The <b>status</b> field contains the current status of the video. After a video upload is successfully completed, the video's <b>status</b> will show as <code>PROCESSING</code> until the video reaches one of the terminal states of <code>LIVE</code>, <code>BLOCKED</code> or <code>PROCESSING_FAILED</code>.<p> If a video's processing fails, it could be because the file is corrupted, is too large, or its size doesn’t match what was provided in the metadata. Refer to the error messages to determine the cause of the video’s failure to upload.</p> <p> The <b>status message</b> will indicate why a video was blocked from uploading.</p><p>The video’s <b>expiration date</b> is automatically set to 365 days (one year) after the video’s initial creation.<p>The video's <b>thumbnail</b> image is automatically generated when the video is created. */
  getVideo: {
    parameters: {
      path: {
        /** @description The unique identifier of the video to be retrieved. */
        video_id: string;
      };
    };
    responses: {
      /** @description OK */
      200: {
        content: {
          "application/json": components["schemas"]["Video"];
        };
      };
      /** @description Bad Request */
      400: never;
      /** @description Forbidden */
      403: never;
      /** @description Not Found */
      404: never;
      /** @description Internal Server Error */
      500: never;
    };
  };
  /** @description This method associates the specified file with the specified <b>video ID</b> and uploads the input file. After the file has been uploaded the processing of the file begins.<br /><br /><span class="tablenote"><span style="color:#004680"><strong>Note:</strong></span> The size of the video to be uploaded must exactly match the size of the video's input stream that was set in the <a href=" /api-docs/commerce/media/resources/video/methods/createVideo" target="_blank">createVideo</a> method. If the sizes do not match, the video will not upload successfully.</span><br /><br />When a video is successfully uploaded, it returns the HTTP Status Code <code>200 OK</code>.<br /><br />The status flow is <code>PENDING_UPLOAD</code> > <code>PROCESSING</code> > <code>LIVE</code>,  <code>PROCESSING_FAILED</code>, or <code>BLOCKED</code>. After a video upload is successfully completed, the status will show as <code>PROCESSING</code> until the video reaches one of the terminal states of <code>LIVE</code>, <code>BLOCKED</code>, or <code>PROCESSING_FAILED</code>. If the size information (in bytes) provided is incorrect, the API will throw an error.<br /><br /><span class="tablenote"><span style="color:#478415"><strong>Tip:</strong></span> See <a href="https://www.ebay.com/help/selling/listings/creating-managing-listings/add-video-to-listing?id=5272#section3" target="_blank">Adding a video to your listing</a> in the eBay Seller Center for details about video formatting requirements and restrictions, or visit the relevant eBay site help pages for the region in which the listings will be posted.</span><br /><br />To retrieve an uploaded video, use the <a href="/api-docs/commerce/media/resources/video/methods/getVideo" target="_blank">getVideo</a> method. */
  uploadVideo: {
    parameters: {
      header: {
        /** @description Use this header to specify the content length for the upload. Use Content-Range: bytes {1}-{2}/{3} and Content-Length:{4} headers.<br /><br /><span class="tablenote"><span style="color:#004680"><strong>Note:</strong></span> This header is optional and is only required for <i>resumable</i> uploads (when an upload is interrupted and must be resumed from a certain point).</span> */
        "Content-Length"?: string;
        /** @description Use this header to specify the content range for the upload. The Content-Range should be of the following bytes ((?:[0-9]+-[0-9]+)|\\\\*)/([0-9]+|\\\\*) pattern.<br /><br /><span class="tablenote"><span style="color:#004680"><strong>Note:</strong></span> This header is optional and is only required for <i>resumable</i> uploads (when an upload is interrupted and must be resumed from a certain point).</span> */
        "Content-Range"?: string;
        /** @description Use this header to specify the content type for the upload. The Content-Type should be set to <code>application/octet-stream</code>. */
        "Content-Type": string;
      };
      path: {
        /** @description The unique identifier of the video to be uploaded. */
        video_id: string;
      };
    };
    /** @description The request payload for this method is the input stream for the video source. The input source must be an .mp4 file of the type MPEG-4 Part 10 or Advanced Video Coding (MPEG-4 AVC). */
    requestBody?: {
      content: {
        "application/json": components["schemas"]["InputStream"];
      };
    };
    responses: {
      /** @description OK */
      200: never;
      /** @description Bad Request */
      400: never;
      /** @description Not Found */
      404: never;
      /** @description Conflict */
      409: never;
      /** @description Content Length Required */
      411: never;
      /** @description Range Not Satisfiable */
      416: never;
      /** @description Internal Server Error */
      500: never;
    };
  };
}
