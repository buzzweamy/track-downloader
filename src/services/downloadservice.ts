import { MusicTrack, PitchforkAlbum } from '../models/';
import { DownloadUrlType } from '../enums/';
import { FileService } from '../services/fileservice';

export class DownloadService {


    public static downloadTracks(album: PitchforkAlbum) {
        let cmd = require('node-cmd');

        album.Tracks.forEach(track => {
            FileService.appendToLogFile("Downloading " + track.toString());
            FileService.appendToLogFile(DownloadService.getCommandInstruction(track))
            cmd.get(DownloadService.getCommandInstruction(track),
                (err: any, data: any, stderr: any) => {
                    //FileService.appendToLogFile(data);
                    if (err) {
                        console.log(err);
                        FileService.appendToLogFile("Error occured for file: " + track.toString());
                        FileService.appendToLogFile(err);
                    }
                });
        });
    }

    private static getCommandInstruction(track: MusicTrack) : string {
        if (track.DownloadUrl.DownloadUrlType == DownloadUrlType.VIDEO) {
            return 'youtube-dl -o "' + track.TrackNumber + ' - ' + track.Artist + ' - ' + track.Title + '.%(ext)s" --extract-audio --audio-format mp3 ' + track.DownloadUrl.Location;
        }
        else {
            return 'youtube-dl -o "' + track.TrackNumber + ' - ' + track.Artist + ' - ' + track.Title + '.mp3" ' + track.DownloadUrl.Location;
        }
    }



}