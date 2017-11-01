import * as fs from 'fs';
import * as _ from 'lodash';
import * as constants from '../constants/';
import * as moment from 'moment';
import { MusicTrack } from '../models/';

export class FileService {

    public static path: string = "./output/";

    public static writeTrackListToFile(tracks: MusicTrack[], printDate? : boolean) {
        fs.appendFileSync(FileService.path + constants.TRACKLIST_FILENAME, "Generated on " + moment().toString() + "\n\n");
        fs.appendFileSync(FileService.path + constants.TRACKLIST_FILENAME, "Track,Artist,Title,Date,Download Url\n");


        _.map(tracks, track => {
            try {
                fs.appendFileSync(FileService.path + constants.TRACKLIST_FILENAME, track.outputToLine(printDate));
            }
            catch(error) {
                console.log(error);
            }
        });
    }

    public static appendToLogFile(line: string) {
        try {
            fs.appendFileSync(FileService.path + constants.LOGS_FILENAME, line + "\n");
        }
        catch(error) {
            console.log(error);
        }
    }
}