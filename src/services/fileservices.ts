import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as constants from '../constants/';
import * as moment from 'moment';
import { MusicTrack } from '../models/';

export const WriteTrackListToFile = (tracks: MusicTrack[], printDate?: boolean) => {
    fs.appendFileSync(constants.OUTPUT_PATH + constants.TRACKLIST_FILENAME, "Generated on " + moment().toString() + "\n\n");
    fs.appendFileSync(constants.OUTPUT_PATH + constants.TRACKLIST_FILENAME, "Track,Artist,Title,Date,Download Url\n");


    _.map(tracks, track => {
        try {
            fs.appendFileSync(constants.OUTPUT_PATH + constants.TRACKLIST_FILENAME, track.outputToLine(printDate));
        }
        catch (error) {
            console.log(error);
        }
    });
}

export const AppendToLogFile = (line: string) => {
    try {
        fs.appendFileSync(constants.OUTPUT_PATH + constants.LOGS_FILENAME, line + "\n");
    }
    catch (error) {
        console.log(error);
    }
}

/**
 * Clean up all files in specified directory
 * @param outputPath directory to purge files from
 */
export const CleanupDirectory = (outputPath: string) => {
    let files = fs.readdirSync(outputPath);

    _.forEach(files, file => {
        fs.unlinkSync(path.join(outputPath, file));
    });

}