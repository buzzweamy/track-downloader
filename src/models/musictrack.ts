import * as moment from 'moment';
import * as _ from 'lodash';
import { List, Track } from '../dtos/tracklistdto';
import { Artist } from '../dtos/tracklistdto';
import { DATE_FORMAT, BASE_PFORK_URL } from '../constants/';
import { TrackType, DownloadUrlType } from '../enums/';

/**
 * Represents track object with all required fields for downloading and tagging
 */
export class MusicTrack{
    public Artist: string;
    public Title: string;
    public TrackNumber: string;
    public DateStr: string;
    public Filename: string;
    public DownloadUrl: DownloadUrl;
    public ReviewUrl: string;
    public TrackType: TrackType;

    constructor() {
    }

    public static fromDto(listDto: List, trackNumber: number): MusicTrack {
        let newInst = new MusicTrack();
        
        newInst.TrackType = TrackType.PITCHFORK_TRACK;
        newInst.DateStr = moment(listDto.pubDate).format(DATE_FORMAT);
        newInst.DownloadUrl = new DownloadUrl((!_.isNil(listDto.audio_files[0])) ?  listDto.audio_files[0].embed_code : "");
        newInst.ReviewUrl = BASE_PFORK_URL + listDto.url;
        _.map(listDto.tracks, trackDto => {
            newInst.Artist = newInst.getArtistNameFromDto(trackDto.artists).trim();
            newInst.Title = trackDto.display_name.replace(/["“”]/g, '').trim();
            newInst.TrackNumber = (trackNumber < 10) ? "0" + trackNumber.toString() : trackNumber.toString();
        })

        return newInst;
    }

    public outputToLine = (printDate? : boolean) : string => {
        return this.TrackNumber + "," + this.Artist + "," + this.Title + "," + this.DateStr + "," + this.DownloadUrl.Location + "\n";
        //return this.TrackNumber + " - " + this.Artist + " - " + this.Title + " - " + this.DateStr + " - " + this.DownloadUrl + "\n";
    }

    public toString = () : string => {
        return this.TrackNumber + " - " + this.Artist + " - " + this.Title;
    }

    /**
     * Get artist name from List object. Combines potentially multiple artists into one string
     */
    private getArtistNameFromDto(artists: Artist[]) {

        let displayArtist: string =
            _.map(artists, artist => {
                return artist.name;
            })
                .join(" ; ");

        return displayArtist;

    }
}




export class DownloadUrl {
    /**
     * Download URL for track
     */
    public Location: string;
    /**
     * Type of DownloadUrl - i.e. Youtube, Venmo..
     */
    public DownloadUrlType?: DownloadUrlType;

    constructor(downloadUrlLocation: string, downloadUrlType?: DownloadUrlType) {
        this.Location = downloadUrlLocation;
        this.DownloadUrlType = downloadUrlType;
    }
}