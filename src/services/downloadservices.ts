import { MusicTrack, PitchforkAlbum } from '../models/';
import { DownloadUrlType } from '../enums/';
import { AppendToLogFile } from '../services/';

/**
 * Download tracks using youtube-dl
 * @param album The album comprising tracks to be downloaded
 */
export const DownloadTracks = (album: PitchforkAlbum) => {
    let cmd = require('node-cmd');


    album.Tracks.forEach(track => {
        AppendToLogFile("Downloading " + track.toString());
        AppendToLogFile(BuildCommandInstruction(track))
        cmd.get(BuildCommandInstruction(track),
            (err: any, data: any, stderr: any) => {
                if (err) {
                    console.log(err);
                    AppendToLogFile("Error occured for file: " + track.toString());
                    AppendToLogFile(err);
                }
            });
    });
}


/**
 * Get youtube-dl command to download the MusicTrack with specified filename
 * @param track The MusicTrack object
 */

 // TODO make output dir configurable
const BuildCommandInstruction = (track: MusicTrack): string => {
    if (track.DownloadUrl.DownloadUrlType == DownloadUrlType.VIDEO) {
        return 'youtube-dl -o "output/' + track.TrackNumber + ' - ' + track.Artist + ' - ' + track.Title + '.%(ext)s" --extract-audio --audio-format mp3 ' + track.DownloadUrl.Location;
    }
    else {
        return 'youtube-dl -o "output/' + track.TrackNumber + ' - ' + track.Artist + ' - ' + track.Title + '.mp3" ' + track.DownloadUrl.Location;
    }
}
