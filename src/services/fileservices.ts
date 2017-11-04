import * as fs from 'fs';
import * as _ from 'lodash';
import * as constants from '../constants/';
import * as moment from 'moment';
import { MusicTrack } from '../models/';



export const OutputPath = "./output/";

export const WriteTrackListToFile = (tracks: MusicTrack[], printDate?: boolean) => {
    fs.appendFileSync(OutputPath + constants.TRACKLIST_FILENAME, "Generated on " + moment().toString() + "\n\n");
    fs.appendFileSync(OutputPath + constants.TRACKLIST_FILENAME, "Track,Artist,Title,Date,Download Url\n");


    _.map(tracks, track => {
        try {
            fs.appendFileSync(OutputPath + constants.TRACKLIST_FILENAME, track.outputToLine(printDate));
        }
        catch (error) {
            console.log(error);
        }
    });
}

export const AppendToLogFile = (line: string) => {
    try {
        fs.appendFileSync(OutputPath + constants.LOGS_FILENAME, line + "\n");
    }
    catch (error) {
        console.log(error);
    }
}