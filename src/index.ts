import * as fs from 'fs';
import * as constants from './constants/';
import * as _ from 'lodash';
import { GetPitchforkTrackList, WriteTrackListToFile, ValidateTracksAndCreateAlbum, DownloadTracks, CleanupOutputDir } from './services/';
import { MusicTrack, PitchforkAlbum } from './models/';



let timeStart = Date.now();

let testTrack: MusicTrack = new MusicTrack();
testTrack.Artist = 'Opeth';
testTrack.Title = 'Benighted';

let testTrack2: MusicTrack = new MusicTrack();
testTrack2.Artist = 'CoastDream';
testTrack2.Title = 'Soft Moon';

//Cleanup Output Directory
CleanupOutputDir(constants.OUTPUT_PATH);

GetPitchforkTrackList("09/18/2017", "09/24/2017")
.then(tracks => {
    return ValidateTracksAndCreateAlbum(tracks);
})
.then(album => {
    WriteTrackListToFile(album.Tracks);
    DownloadTracks(album);
})
.catch(err => {
    console.log(err);
})

