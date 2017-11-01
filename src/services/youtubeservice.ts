import fetch from 'node-fetch';
import * as _ from 'lodash';
import * as querystring from 'querystring';
import { YOUTUBE_DATA_API_KEY } from '../../config/external-config';
import { MusicTrack, DownloadUrl } from '../models/';
import { YOUTUBE_DATA_API_SEARCH_URL, YOUTUBE_DOWNLOAD_BASE_URL } from '../constants/';
import { YoutubeSearchResultDto } from '../dtos/youtubesearchresultdto';
import { DownloadUrlType } from '../enums/downloadurltype';

class YoutubeSearchQuery {
    public type: string;
    public q: string;
    public maxResults: number = 25;
    public part: string = 'snippet';
    public key: string;

    constructor(track: MusicTrack, apiKey: string) {
        this.q = track.Artist + " - " + track.Title;
        this.key = apiKey;
    }
}

export class YoutubeService {
    /**
     * Youtube Data API Key - load from external config file located at /config/external-config.ts
     */
    private static YOUTUBE_API_KEY:string;

    /**
     * Checks to see if the YoutubeService is correctly configured with API key and any other dependencies
     */
    public static isConfigured: boolean = false;

    

    public static initialize = () => {
        /**
         * Add options to load key through command line or an external config file
         */
        if (!_.isNil(YOUTUBE_DATA_API_KEY)) {
            YoutubeService.YOUTUBE_API_KEY = YOUTUBE_DATA_API_KEY;
            YoutubeService.isConfigured = true;
        }
        else {
            console.log("Could not initialize YoutubeService: missing API key.")
        }
    }
    
    public static async getYoutubeUrlForTrack(track: MusicTrack) : Promise<DownloadUrl> {
        let downloadUrl = "";
        if (YoutubeService.isConfigured) {
            let query: YoutubeSearchQuery = new YoutubeSearchQuery(track, YoutubeService.YOUTUBE_API_KEY);
            
            try {
                let res = await fetch(YOUTUBE_DATA_API_SEARCH_URL + '?' + querystring.stringify(query));
                let json = await res.json();

                let result: YoutubeSearchResultDto = json;
                let firstResult = result.items[0];
                downloadUrl = YOUTUBE_DOWNLOAD_BASE_URL + firstResult.id.videoId;
                console.log("Found youtube link for track %s", track.toString());
                console.log("Youtube URL: %s Video title: %s", downloadUrl, firstResult.snippet.title);
                
            }

            catch(err) {
                console.log("Failed to get youtube url! ", err);
            }
        }
        return new DownloadUrl(downloadUrl, DownloadUrlType.VIDEO);
    }
}

/**
 * Attempt to initialize Youtube Service at application start
 */
(()=> {
    YoutubeService.initialize();
})();