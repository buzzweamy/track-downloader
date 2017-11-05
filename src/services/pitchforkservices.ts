import { TRACKLIST_JSON_URL, TRACKLIST_JSON_BASE_URL, DATE_FORMAT, SUPPORTED_HOSTS, VIDEO_HOSTS } from '../constants/';
import fetch from 'node-fetch';
import * as _ from 'lodash';
import * as moment from 'moment';
import { RootObject, List, Artist } from '../dtos/tracklistdto';
import { MusicTrack, DownloadUrl } from '../models/';
import { DownloadUrlType } from '../enums/index'
import * as Cheerio from 'cheerio';

export const GetPitchforkTrackList = (startDateStr?: string, endDateStr?: string): Promise<MusicTrack[]> => {
    let tracklistData: List[] = [];
    let hosts: string[] = [];
    let startDate: moment.Moment, endDate: moment.Moment;
    let pitchforkTracks: MusicTrack[] = [];

    const FetchTracklist = async (startLocation: number = 
        0): Promise<void> => {
        try {
            let res = await fetch(TRACKLIST_JSON_BASE_URL + "&size=200&start=" + startLocation);
            let json: RootObject = await res.json();
            if (!_.isNil(json)) {
                tracklistData = tracklistData.concat(json.results.list);
            }
        }
        catch (error) {
            console.log("Failed while fetching track list!", error);
        }
    }



    return new Promise<MusicTrack[]>((resolve, reject) => {
        if (_.isNil(startDateStr)) {
            startDate = moment().subtract(1, 'weeks').startOf('isoWeek')
            endDate = moment().subtract(1, 'weeks').endOf('isoWeek')
        }
        else {
            startDate = moment(startDateStr, DATE_FORMAT);
            endDate = _.isNil(endDateStr) ? moment() : moment(endDateStr, DATE_FORMAT);
        }

        let numberOfApiCalls = CalculateNumberOfCalls(startDate);
        console.log("Retrieving tracks for range " + startDate.format(DATE_FORMAT) + "-" + endDate.format(DATE_FORMAT));
        console.log("Number of calls: ", numberOfApiCalls);

        let runningTrackTotal: number = 0;
        let promises = [];

        for (let i = 0; i < numberOfApiCalls; i++) {
            promises.push(FetchTracklist(runningTrackTotal));

            runningTrackTotal = runningTrackTotal + 200;
        }

        Promise.all(promises)
            .then(() => {
                let sortedAndFilteredTrackListData: List[] =
                    _.chain(tracklistData)
                        .filter(track => {
                            let trackDate = moment(track.pub_date);
                            return trackDate.isSameOrAfter(startDate, "day") && trackDate.isSameOrBefore(endDate, "day");
                        })
                        .sortBy(track => {
                            return moment(track.pub_date);
                        })
                        .value();

                if (!_.isNil(sortedAndFilteredTrackListData)) {
                    let count = 1;
                    _.map(sortedAndFilteredTrackListData, tData => {
                        pitchforkTracks.push(MusicTrack.fromDto(tData, count++));
                    })

                    resolve(pitchforkTracks);
                }
            })
            .catch(err => {
                console.log("Error fetching tracklist!", err);
                reject(err);
            })
    })
}



const CalculateNumberOfCalls = (startDate: moment.Moment): number => {
    return Math.ceil((moment().diff(startDate, "days") * 4) / 200);
}

/**
 * Print the tracklist in readable format - "date - artist - track name"
 */
export const PrintTracklist = (tracklist: List[]) => {
    if (!_.isNil(tracklist)) {
        tracklist.forEach(tData => {
            let momentDate = moment(tData.pub_date);
            if (tData.tracks.length > 1) {
                _.map(tData.tracks, track => {
                    console.log(momentDate.format(DATE_FORMAT) + ": " + GetArtistName(track.artists) + " - " + track.display_name.replace(/[“”]/g, ''));

                })
            }
        })

    }
}

/**
 * Get artist name for track. Combines potentially multiple artists into one string
 */
const GetArtistName = (artists: Artist[]) => {

    let displayArtist: string =
        _.map(artists, artist => {
            return artist.name;
        })
            .join(" / ");

    return displayArtist;

}

/**
* Fetch review for track and retrieve download urls which were not included in original track list json.
* @param track PitchorkTrack object from which to retrieve review and download url
*/
export const GetDownloadUrlFromTrackReview = (track: MusicTrack): Promise<DownloadUrl> => {
    let url = "";
    let urlModule = require("url");

    return new Promise<DownloadUrl>((resolve, reject) => {
        if (_.isNil(track.ReviewUrl) || track.ReviewUrl.length == 0) {
            reject("No review URL for track: " + track.toString());
        }

        fetch(track.ReviewUrl)
            .then(resp => {
                return resp.text();
            })
            .then(text => {
                //TODO convert youtube url to non-embed link for youtube-dl
                const $ = Cheerio.load(text);
                let url = $('iframe').attr('src');

                if (_.isNil(url)) {
                    reject();
                }

                let downloadUrlType: DownloadUrlType;
                let host: string = urlModule.parse(url).host;

                if (!SUPPORTED_HOSTS.includes(host)) {
                    reject("Unsupported host:  " + host + " for " + track.toString());
                }

                //filter out latter part of this soundcloud URL for youtube-dl compatibility
                if (host == 'w.soundcloud.com') {
                    url = url.split('&')[0];
                }

                //set downloadUrlType
                downloadUrlType = (VIDEO_HOSTS.includes(host)) ? DownloadUrlType.VIDEO : DownloadUrlType.AUDIO;


                resolve(new DownloadUrl(url, downloadUrlType));
            })
            .catch(err => {
                reject(err);
            })
    });
}


/**
 * Retrieve track list from external URLs.
 * Currently used to fetch track list json from pitchfork.
 */
// export class PitchforkService {

//     private static tracklistData: List[] = [];
//     public static hosts: string[] = [];

//     /**
//      * Return a promise with Pitchfork tracks for the specified date range.
//      * Each tracklist api call has a limit of 200 tracks.
//      * If startDateStr and endDateStr are specified, get tracklist between those dates.
//      * If only startDateStr is specified, get entire tracklist from the start date to now.
//      * If neither is specified, get tracklist for most recent full week.
//      */
//     public static getTracks = (startDateStr?: string, endDateStr?: string): Promise<MusicTrack[]> => {
//         let startDate: moment.Moment, endDate: moment.Moment;
//         let pitchforkTracks: MusicTrack[] = [];

//         return new Promise<MusicTrack[]>((resolve, reject) => {
//             if (_.isNil(startDateStr)) {
//                 startDate = moment().subtract(1, 'weeks').startOf('isoWeek')
//                 endDate = moment().subtract(1, 'weeks').endOf('isoWeek')
//             }
//             else {
//                 startDate = moment(startDateStr, DATE_FORMAT);
//                 endDate = _.isNil(endDateStr) ? moment() : moment(endDateStr, DATE_FORMAT);
//             }

//             let numberOfApiCalls = PitchforkService.calculateNumberOfCalls(startDate);
//             console.log("Retrieving tracks for range " + startDate.format(DATE_FORMAT) + "-" + endDate.format(DATE_FORMAT));
//             console.log("Number of calls: ", numberOfApiCalls);

//             let runningTrackTotal: number = 0;
//             let promises = [];

//             for (let i = 0; i < numberOfApiCalls; i++) {
//                 promises.push(PitchforkService.fetchTracklist(runningTrackTotal));

//                 runningTrackTotal = runningTrackTotal + 200;
//             }

//             Promise.all(promises)
//                 .then(() => {
//                     let sortedAndFilteredTrackListData: List[] =
//                         _.chain(PitchforkService.tracklistData)
//                             .filter(track => {
//                                 let trackDate = moment(track.pub_date);
//                                 return trackDate.isSameOrAfter(startDate, "day") && trackDate.isSameOrBefore(endDate, "day");
//                             })
//                             .sortBy(track => {
//                                 return moment(track.pub_date);
//                             })
//                             .value();

//                     if (!_.isNil(sortedAndFilteredTrackListData)) {
//                         let count = 1;
//                         _.map(sortedAndFilteredTrackListData, tData => {
//                             pitchforkTracks.push(MusicTrack.fromDto(tData, count++));
//                         })

//                         resolve(pitchforkTracks);
//                     }
//                 })
//                 .catch(err => {
//                     console.log("Error fetching tracklist!", err);
//                     reject(err);
//                 })
//         })
//     }



//     /**
//      * Fetch tracklist from given starting location and concatenate to tracklistData.
//      * @param startLocation - Starting location of each call to account for calls being limited to 200 tracks.
//      */
//     private static async fetchTracklist(startLocation: number = 0): Promise<void> {
//         try {
//             let res = await fetch(TRACKLIST_JSON_BASE_URL + "&size=200&start=" + startLocation);
//             let json: RootObject = await res.json();
//             if (!_.isNil(json)) {
//                 this.tracklistData = this.tracklistData.concat(json.results.list);
//             }
//         }
//         catch (error) {
//             console.log("Failed while fetching track list!", error);
//         }
//     }

//     /**
//      * Get number of calls needed to reach the start date. Each call has a limit of 200 tracks.
//      */
//     private static calculateNumberOfCalls(startDate: moment.Moment): number {
//         return Math.ceil((moment().diff(startDate, "days") * 4) / 200);
//     }


//     /**
//      * Print the tracklist in readable format - "date - artist - track name"
//      */
//     private static printTracklist = (tracklist: List[]) => {
//         if (!_.isNil(tracklist)) {
//             tracklist.forEach(tData => {
//                 let momentDate = moment(tData.pub_date);
//                 if (tData.tracks.length > 1) {
//                     _.map(tData.tracks, track => {
//                         console.log(momentDate.format(DATE_FORMAT) + ": " + PitchforkService.getArtistName(track.artists) + " - " + track.display_name.replace(/[“”]/g, ''));

//                     })
//                 }
//             })

//         }
//     }

//     /**
//      * Get artist name for track. Combines potentially multiple artists into one string
//      */
//     private static getArtistName(artists: Artist[]) {

//         let displayArtist: string =
//             _.map(artists, artist => {
//                 return artist.name;
//             })
//                 .join(" / ");

//         return displayArtist;

//     }

//     /**
//      * Fetch review for track and retrieve download urls which were not included in original track list json.
//      * @param track PitchorkTrack object from which to retrieve review and download url
//      */
//     public static getDownloadUrlFromTrackReview(track: MusicTrack): Promise<DownloadUrl> {
//         let url = "";
//         let urlModule = require("url");

//         return new Promise<DownloadUrl>((resolve, reject) => {
//             if (_.isNil(track.ReviewUrl) || track.ReviewUrl.length == 0) {
//                 reject("No review URL for track: " + track.toString());
//             }

//             fetch(track.ReviewUrl)
//                 .then(resp => {
//                     return resp.text();
//                 })
//                 .then(text => {
//                     //TODO convert youtube url to non-embed link for youtube-dl
//                     const $ = Cheerio.load(text);
//                     let url = $('iframe').attr('src');

//                     if (_.isNil(url)) {
//                         reject();
//                     }

//                     let downloadUrlType: DownloadUrlType;
//                     let host: string = urlModule.parse(url).host;

//                     if (!SUPPORTED_HOSTS.includes(host)) {
//                         reject("Unsupported host:  " + host + " for " + track.toString());
//                     }

//                     //filter out latter part of this soundcloud URL for youtube-dl compatibility
//                     if (host == 'w.soundcloud.com') {
//                         url = url.split('&')[0];
//                     }

//                     //set downloadUrlType
//                     downloadUrlType = (VIDEO_HOSTS.includes(host)) ? DownloadUrlType.VIDEO : DownloadUrlType.AUDIO;


//                     resolve(new DownloadUrl(url, downloadUrlType));
//                 })
//                 .catch(err => {
//                     reject(err);
//                 })
//         });
//     }
// }