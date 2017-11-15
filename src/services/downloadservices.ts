import { MusicTrack, PitchforkAlbum } from '../models/';
import { DownloadUrlType } from '../enums/';
import { AppendToLogFile, GetDownloadUrlForTrack, YoutubeService } from '../services/';
import { OUTPUT_PATH } from '../constants';
import { TrackType } from '../enums/tracktype';
import * as tp from 'typed-promisify';
import { exec } from 'child_process';
import * as _ from 'lodash';


const execPromise = tp.promisify(exec);

/**
 * Download tracks using youtube-dl
 * @param album The album (or collection of tracks) to download
 */
export const DownloadTracks = (album: PitchforkAlbum) => {
    let promises: Promise<void | {}>[] = [];
    let errors: MusicTrack[] = [];

    album.Tracks.forEach(track => {
        AppendToLogFile("Downloading " + track.toString());
        AppendToLogFile(BuildCommandInstruction(track));

        promises.push(execPromise(BuildCommandInstruction(track))
            .catch(err => {
                console.log(err);
                AppendToLogFile("Error occured for file: " + track.toString());
                AppendToLogFile(err);
                errors.push(track);
            }
            ));
    });

    Promise.all(promises)
        .then(() => {
            _.forEach(errors, track => {
                retryDownload(track);
            })

            console.log("Finished downloading files, can validate now");
        });
}

/**
 * Attempt to redownload track with new download url from youtube
 * @param track MusicTrack to retry downloading
 */
const retryDownload = (track: MusicTrack) => {
    //get track DownloadUrl from youtube
    YoutubeService.getYoutubeUrlForTrack(track)
    .then(downloadUrl => {
        track.DownloadUrl = downloadUrl;
        AppendToLogFile("Retrying track: " +  track.toString() +   "from " + track.DownloadUrl.Location);

        execPromise(BuildCommandInstruction(track))
        .then(data => {
            AppendToLogFile("Retry download suceeded for track: " + track.toString());
        })
        .catch(err => {
            console.log(err);
            AppendToLogFile("Retry download failed for track: " + track.toString());    
        });
    });
}


/**
 * Get youtube-dl command to download the MusicTrack
 * @param track MusicTrack object to build command for
 */
const BuildCommandInstruction = (track: MusicTrack): string => {
    if (track.DownloadUrl.DownloadUrlType == DownloadUrlType.VIDEO) {
        return 'youtube-dl -o "' + OUTPUT_PATH + track.Filename + '.%(ext)s" --extract-audio --audio-format mp3 ' + track.DownloadUrl.Location;
    }
    else {
        return 'youtube-dl -o "' + OUTPUT_PATH + track.Filename + '.mp3" ' + track.DownloadUrl.Location;
    }
}
