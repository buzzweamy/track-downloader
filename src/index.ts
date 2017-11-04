import * as fs from 'fs';
import * as constants from './constants/';
import * as _ from 'lodash';
import { PitchforkService, WriteTrackListToFile, ValidateTracksAndCreateAlbum } from './services/';
import { DownloadTracks } from './services/';
import { MusicTrack, PitchforkAlbum } from './models/';




let timeStart = Date.now();
let path: string = "./output/";
//TODO - remove this later, for now clear out output folder
try {
    fs.unlinkSync(path + constants.TRACKLIST_FILENAME);
    fs.unlinkSync(path + constants.LOGS_FILENAME);
}
catch(err) {
    console.log(err);
}


let testTrack: MusicTrack = new MusicTrack();
testTrack.Artist = 'Opeth';
testTrack.Title = 'Benighted';

let testTrack2: MusicTrack = new MusicTrack();
testTrack2.Artist = 'CoastDream';
testTrack2.Title = 'Soft Moon';


PitchforkService.getTracks("09/18/2017", "09/24/2017")
.then(tracks => {
    return ValidateTracksAndCreateAlbum(tracks);
})
.then(album => {
    WriteTrackListToFile(album.Tracks);
    //DownloadTracks(album);
})
.catch(err => {
    console.log(err);
})

