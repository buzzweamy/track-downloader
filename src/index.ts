import * as fs from 'fs';
import * as constants from './constants/';
import * as _ from 'lodash';
import { GetPitchforkTrackList, WriteTrackListToFile, ValidateTracksAndCreateAlbum, DownloadTracks, CleanupDirectory, ZipFiles, TagAlbum } from './services/';
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

//GetPitchforkTrackList("09/18/2017", "09/24/2017")
//GetPitchforkTrackList("11/13/2017", "11/19/2017")

/**
 * Download tracks from this date 
 */
//TODO make this an argument to be passed in
let TRACKS_DATE: string = "10/16/2017";


GetPitchforkTrackList(TRACKS_DATE)
.then(tracks => {
    return ValidateTracksAndCreateAlbum(tracks, "Pitchfork Tracks " + TRACKS_DATE.replace(/\//g, "-"));
})
.then(album => {
    WriteTrackListToFile(album);
    return DownloadTracks(album);
})
.then(album => {
    TagAlbum(album);
})
// .then(album => {
//         console.log("All files downloaded - now tagging...");
//         TagAlbum(album);
//         console.log("All files downloaded - now zipping...");
//         //ZipFiles(album);
// })
.catch(err => {
    console.log(err);
})

