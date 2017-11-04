import { MusicTrack, DownloadUrl, PitchforkAlbum } from '../models/';
import { PitchforkService, YoutubeService } from '../services/';
import { TrackType } from '../enums/tracktype';
import * as _ from 'lodash';

/**
 * Validate each track has a valid download url and create album
 * @param tracks Array of music tracks to validate and create album from
 */
export const ValidateTracksAndCreateAlbum = (tracks: MusicTrack[]): Promise<PitchforkAlbum> => {

    return new Promise<PitchforkAlbum>((resolve, reject) => {
        let promises: Promise<DownloadUrl>[] = [];

        _.forEach(tracks, track => {
            if (_.isNil(track.DownloadUrl) || _.isNil(track.DownloadUrl.Location) || track.DownloadUrl.Location == "") {
                promises.push(GetDownloadUrlForTrack(track)
                    .then(downloadUrl => {
                        track.DownloadUrl = downloadUrl;
                        return downloadUrl;
                    })
                    .catch(err => {
                        console.log("Unable to retrieve downloadURL: ", err);
                        return new DownloadUrl("");
                        //return null;
                    }));
            }
        });

        Promise.all(promises)
            .then(() => {
                resolve(new PitchforkAlbum("TestAlbum", "10-25-2017", tracks));
                //construct album here?
                //resolve(tracks);
            })
            .catch(err => {
                console.log("Error while getting remaining download urls");
                reject(err);
            })
    });
}

/**
 * Get a download url for MusicTrack, either from pitchfork or after youtube query
 * @param track The MusicTrack
 */
export const GetDownloadUrlForTrack = async (track: MusicTrack): Promise<DownloadUrl> => {
    if (track.TrackType == TrackType.PITCHFORK_TRACK) {
        try {
            let downloadUrl = await PitchforkService.getDownloadUrlFromTrackReview(track);
            return downloadUrl;
        }
        catch (err) {
            //console.log(err);
        }
    }

    // if no valid download url on pitchfork, or is non-pitchfork track, then search youtube
    let downloadUrl = await YoutubeService.getYoutubeUrlForTrack(track);
    return downloadUrl;
}

/**
 * Add track number to tracks if missing
 * @param tracks Array of music tracks
 */
export const EnsureTracksAreNumbered = (tracks:MusicTrack[]): MusicTrack[] => {
    let count = 0;
    _.forEach(tracks, track => {
        count++;
        if (_.isNil(track.TrackNumber)) {
            track.TrackNumber = (count < 10) ? "0" + count.toString() : count.toString();
        }
    })
    return tracks;
}