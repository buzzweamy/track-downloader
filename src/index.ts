import * as fs from 'fs';
import * as constants from './constants/';
import * as _ from 'lodash';
import { GetPitchforkTrackList, WriteTrackListToFile, ValidateTracksAndCreateAlbum, DownloadTracks, CleanupDirectory, ZipFiles } from './services/';
import { MusicTrack, Album } from './models/';



let timeStart = Date.now();

let testTrack: MusicTrack = new MusicTrack();
testTrack.Artist = 'Opeth';
testTrack.Title = 'Benighted';

let testTrack2: MusicTrack = new MusicTrack();
testTrack2.Artist = 'CoastDream';
testTrack2.Title = 'Soft Moon';

let standaloneTracks: MusicTrack[] = [];
standaloneTracks.push(testTrack, testTrack2);

//Cleanup Output Directory
CleanupDirectory(constants.OUTPUT_PATH);
CleanupDirectory("./zips/");

GetPitchforkTrackList("09/18/2017", "09/24/2017")
.then(tracks => {
    return ValidateTracksAndCreateAlbum(tracks);
})
.then(album => {
    WriteTrackListToFile(album.Tracks);
    return DownloadTracks(album);
})
.then(success => {
    if (success == true) {
        console.log("All files downloaded - now zipping...");
        ZipFiles(constants.OUTPUT_PATH, "PitchForkTracks");
    }
})
.catch(err => {
    console.log(err);
})

