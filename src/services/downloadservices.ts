import { MusicTrack, Album } from '../models/';
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
export const DownloadTracks = (album: Album): Promise<Album> => {

    return new Promise<Album>((resolve, reject) => {
        let promises: Promise<void | {}>[] = [];
        let retryPromises: Promise<void | {}>[] = [];
        let errors: MusicTrack[] = [];

        album.Tracks.forEach(track => {
            AppendToLogFile("Downloading " + track.toString());
            AppendToLogFile(BuildCommandInstruction(track, album.AlbumDirName));

            promises.push(execPromise(BuildCommandInstruction(track, album.AlbumDirName))
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
                if (errors.length > 0) {
                    retryFailedTracks(errors, album)
                    .then(success => {
                        if (success == true) {
                            console.log("")
                            resolve(album);
                        }
                        else {reject()}
                    })
                }
                else {resolve(album);}
            })
            .catch(err => {
                console.log(err);
                reject();
            });
    });
}

/**
 * Attempt to redownload track with new download url from youtube
 * @param track MusicTrack to retry downloading
 */
//this should return a promise which will be added to retryPromises array in DownloadTracks
const retryDownload = (track: MusicTrack, album: Album) :Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        //get track DownloadUrl from youtube
        YoutubeService.getYoutubeUrlForTrack(track)
            .then(downloadUrl => {
                track.DownloadUrl = downloadUrl;
                AppendToLogFile("Retrying track: " + track.toString() + "from " + track.DownloadUrl.Location);

                execPromise(BuildCommandInstruction(track, album.AlbumDirName))
                    .then(data => {
                        AppendToLogFile("Retry download suceeded for track: " + track.toString());
                        resolve(true);
                    })
                    .catch(err => {
                        console.log(err);
                        AppendToLogFile("Retry download failed for track: " + track.toString());
                        reject(false);
                    });
            });
    });
}


/**
 * Attempt to redownload failed tracks
 * @param failedTracks MusicTrack collection of failed tracks
 */
const retryFailedTracks = (failedTracks: MusicTrack[], album: Album) :Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        let retryPromises: Promise<void | {}>[] = [];
        _.forEach(failedTracks, track => {
            retryPromises.push(retryDownload(track, album));
        });

        Promise.all(retryPromises)
            .then(() => {
                resolve(true);
            })
            .catch(err => {
                console.log(err);
                reject(false);
            })
    });


}


/**
 * Get youtube-dl command to download the MusicTrack
 * @param track MusicTrack object to build command for
 */
const BuildCommandInstruction = (track: MusicTrack, dirName?: string): string => {
    let outputDir = !_.isNil(dirName) ? OUTPUT_PATH + dirName + '/' : OUTPUT_PATH;

    //if file output is wav, need to convert to mp3. This should cover all options
    return 'youtube-dl -o "' + outputDir + track.Filename + '.%(ext)s" --extract-audio --audio-format mp3 ' + track.DownloadUrl.Location;

    // if (track.DownloadUrl.DownloadUrlType == DownloadUrlType.VIDEO) {
    //     return 'youtube-dl -o "' + outputDir + track.Filename + '.%(ext)s" --extract-audio --audio-format mp3 ' + track.DownloadUrl.Location;
    // }
    // else {
    //     return 'youtube-dl -o "' + outputDir + track.Filename + '.mp3" ' + track.DownloadUrl.Location;
    // }
}
