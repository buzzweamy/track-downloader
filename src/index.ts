import * as fs from 'fs';
import * as constants from './constants/';
import * as _ from 'lodash';
import { PitchforkService, FileService, TrackService } from './services/';
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
    return TrackService.validateAndCreateAlbum(tracks);
})
.then(album => {
    FileService.writeTrackListToFile(album.Tracks);
    DownloadTracks(album);
})
.catch(err => {
    console.log(err);
})


//let trackCollection: PitchforkAlbum = new PitchforkAlbum('Test Album', '10/16/2017', [testTrack]);

// TrackService.validateAndCreateAlbum([testTrack, testTrack2])
// .then(album => {
//     FileService.writeTrackListToFile(album.Tracks);
//     DownloadService.downloadTracks(album);
// })

//DownloadService.downloadTracks(trackCollection);


//let tracks: PitchforkTrack[] = [testTrack];


// TrackService.validateAndGetRemainingDownloadUrls(tracks)
// .then(tracks => {
//     let trackCollection: PitchforkAlbum = new PitchforkAlbum('Test Album', '10/16/2017', tracks);
//     DownloadService.downloadTracks(trackCollection);
// })
// .catch(err => {
//     console.log(err);
// })

//DownloadService.downloadTracks();





// PitchforkService.getTracks()
// .then(tracks => {
//     //can be made to run concurrently but may be not necessary
//     return TrackService.validateAndGetRemainingDownloadUrls(tracks);
    
// })
// .then(tracks => {
//     FileService.writeTrackListToFile(tracks, path, true);
//     let timeEnd = Date.now();
//     console.log("Time elapsed: " + ((timeEnd - timeStart) / 1000).toFixed(2)  + " s");
// })
// .catch(err => {
//     console.log("Failed to retrieve tracklist", err);
// });

