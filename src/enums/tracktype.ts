export enum TrackType {
    /**
     * Base track with no review URL - we'll have to find the downloadUrl by querying Youtube
     */
    BASE_TRACK,
    /**
     * Track originating from Pitchfork's Latest Tracks Section - will contain Review URL which we can parse
     * for downloadURLs
     */
    PITCHFORK_TRACK
}