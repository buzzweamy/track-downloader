import { MusicTrack } from './';
import { ValidateAlbumTracks } from '../services/';


export class Album {
    /**
     * Name of this album - used in mp3 tags
     */
    public AlbumName: string;
    /**
     * Starting date of this album
     */
    public StartDate: string;
    /**
     * Collection of tracks making up this album
     */
    public Tracks: MusicTrack[];

    constructor(albumName: string, startDate: string, tracks: MusicTrack[]) {
        this.AlbumName = albumName;
        this.StartDate = startDate;
        this.Tracks = ValidateAlbumTracks(tracks);
    }

}