import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as constants from '../constants/';
import * as moment from 'moment';
import { MusicTrack } from '../models/';
import { GetTimestamp } from '../utils/';
import * as archiver from 'archiver';


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
    if (fs.existsSync(outputPath)) {
        let files = fs.readdirSync(outputPath);

        _.forEach(files, file => {
            fs.unlinkSync(path.join(outputPath, file));
        });
    }

}

/**
 * Adds all files in path to a single zip file
 * @param path directory to zip files from
 * @param zipFilename generate zip filename
 */
export const ZipFiles = (path: string, zipFilename: string) => {
    if (fs.existsSync(path)) {
        let output = fs.createWriteStream('./zips/' + zipFilename + '.' + GetTimestamp() + '.zip');
        let archive = archiver('zip', { zlib: { level: 9 } });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('Zip complete.');
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function () {
            console.log('Data has been drained');
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });


        // good practice to catch this error explicitly
        archive.on('error', function (err) {
            throw err;
        });

        // pipe archive data to the file
        archive.pipe(output);

        archive.directory(path, false);

        archive.finalize();
    }
    else {
        AppendToLogFile("Error while zipping: Path - " + path + " not found!");
    }


}