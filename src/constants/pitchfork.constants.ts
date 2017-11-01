/**
 * Base Pitchfork URL
 */
export const BASE_PFORK_URL: string = "https://pitchfork.com";

/**
 * Base URL for json represting track list data
 */
 export const TRACKLIST_JSON_BASE_URL: string = BASE_PFORK_URL + "/api/v2/search/?failIfEmpty=true&types=reviews&hierarchy=sections%2Freviews%2Ftracks&sort=publishdate%20desc";

/**
 * Append to TRACK_LIST_JSON_BASE_URL to retrieve latest 200 tracks
 */
 export const TRACKLIST_JSON_URL: string = BASE_PFORK_URL + TRACKLIST_JSON_BASE_URL + "size=200&start=0";

 /**
  * Standard Date format string
  */
  export const DATE_FORMAT: string = "MM/DD/YYYY";

  /**
   * Whitelist of site hostnames supported by youtube-dl
   */
  export const SUPPORTED_HOSTS: string[] = ['w.soundcloud.com', 'bandcamp.com', 'www.youtube.com', 'player.vimeo.com'];

  /**
   * Hosts with video track - will need to convert to audio
   */
    export const VIDEO_HOSTS: string[] = ['www.youtube.com', 'player.vimeo.com']

  /**
   * Known unsupported hosts - mainly kept here for reference
   */
   export const UNSUPPORTED_HOSTS: string[] = ['embed.spotify.com', 'open.spotify.com', 'embed.itunes.apple.com', 'tools.applemusic.com', 'html.pitchfork.com', 'as-embed-player.adultswim.com', 'media.iheart.com'];


