import { MusicTrack, DownloadUrl, Album } from '../models/';
import { GetDownloadUrlFromTrackReview, YoutubeService } from '../services/';
import { TrackType } from '../enums/tracktype';
import { ReplaceWindowsReservedCharacters } from './../utils/';
import * as constants from '../constants';
import * as _ from 'lodash';

const NodeID3 = require('node-id3');

/**
 * Validate each track has a valid download url and create album
 * @param tracks Array of music tracks to validate and create album from
 */
export const ValidateTracksAndCreateAlbum = (tracks: MusicTrack[], albumName: string): Promise<Album> => {

    return new Promise<Album>((resolve, reject) => {
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
                resolve(new Album(albumName, "10-25-2017", tracks));
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

export const TagAlbum = (album: Album) => {
    _.forEach(album.Tracks, track => {
        let file = constants.OUTPUT_PATH + album.AlbumDirName + '/' + track.Filename + '.mp3';
        console.log('Writing tags to file: ', file);
        let tags = {
            title: track.Title,
            artist: track.Artist,
            album: album.AlbumName,
            trackNumber: track.TrackNumber,
            TPE2: "Various Artists"
        }

        let ID3FrameBuffer = NodeID3.create(tags)   //  Returns ID3-Frame buffer
        //  Asynchronous
        //NodeID3.create(tags, function (frame: any) { })

        //  Write ID3-Frame into (.mp3) file
        let success = NodeID3.write(tags, file) //  Returns true/false
        //NodeID3.write(tags, file, function (err: any) { })

    })

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