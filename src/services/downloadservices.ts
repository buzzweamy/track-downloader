import { MusicTrack, PitchforkAlbum } from '../models/';
import { DownloadUrlType } from '../enums/';
import { AppendToLogFile } from '../services/';
import { OUTPUT_PATH } from '../constants';
import * as tp from 'typed-promisify';
import { exec } from 'child_process';

/**
 * Download tracks using youtube-dl
 * @param album The album comprising tracks to be downloaded
 */
export const DownloadTracks = (album: PitchforkAlbum) => {
    let execPromise = tp.promisify(exec);
    let promises: Promise<void | {}>[] = [];

    album.Tracks.forEach(track => {
        AppendToLogFile("Downloading " + track.toString());
        AppendToLogFile(BuildCommandInstruction(track));

        promises.push(execPromise(BuildCommandInstruction(track))
            .catch(err => {
                console.log(err);
                AppendToLogFile("Error occured for file: " + track.toString());
                AppendToLogFile(err);
            }
            ));
    });

    Promise.all(promises)
        .then(() => {
            console.log("Finished downloading files, can validate now");
        });
}


/**
 * Get youtube-dl command to download the MusicTrack with specified filename
 * @param track The MusicTrack object
 */

const BuildCommandInstruction = (track: MusicTrack): string => {
    if (track.DownloadUrl.DownloadUrlType == DownloadUrlType.VIDEO) {
        return 'youtube-dl -o "' + OUTPUT_PATH + track.TrackNumber + ' - ' + track.Artist + ' - ' + track.Title + '.%(ext)s" --extract-audio --audio-format mp3 ' + track.DownloadUrl.Location;
    }
    else {
        return 'youtube-dl -o "' + OUTPUT_PATH + track.TrackNumber + ' - ' + track.Artist + ' - ' + track.Title + '.mp3" ' + track.DownloadUrl.Location;
    }
}
