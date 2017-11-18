import { MusicTrack, DownloadUrl, PitchforkAlbum } from '../models/';
import { GetDownloadUrlFromTrackReview, YoutubeService } from '../services/';
import { TrackType } from '../enums/tracktype';
import { ReplaceWindowsReservedCharacters } from './../utils/';
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
            let downloadUrl = await GetDownloadUrlFromTrackReview(track);
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

export const getFilenameForTrack = (track: MusicTrack): string => {
    if (track.TrackNumber && track.TrackNumber !== '' && track.Artist && track.Artist !== '' && track.Title && track.Title !== '') {
        return ReplaceWindowsReservedCharacters(track.TrackNumber + " - " + track.Artist + " - " + track.Title, ' ');
    }

    else {
        console.log('Failed to get filename for track. Track missing one or more required properties.');
        return '';
    }
}

/**
 * Perform validations against album and fill in missing details
 * @param tracks Collection of music tracks
 */
export const ValidateAlbumTracks = (tracks: MusicTrack[]): MusicTrack[] => {
    tracks = ensureTracksAreNumbered(tracks);
    tracks = ensureTracksHaveFilenames(tracks);
    return tracks;
}

/**
 * Add track number to tracks if missing
 * @param tracks Collection of music tracks
 */
const ensureTracksAreNumbered = (tracks: MusicTrack[]): MusicTrack[] => {
    let count = 0;
    _.forEach(tracks, track => {
        count++;
        if (_.isNil(track.TrackNumber)) {
            track.TrackNumber = (count < 10) ? "0" + count.toString() : count.toString();
        }
    });
    return tracks;
}

/**
 * Add Filename to tracks if missing
 * @param tracks Collection of music tracks
 */
const ensureTracksHaveFilenames = (tracks: MusicTrack[]): MusicTrack[] => {
    _.forEach(tracks, track => {
        if (_.isNil(track.Filename)) {
            track.Filename = getFilenameForTrack(track);
        }
    });
    return tracks;
}