import { MusicTrack, DownloadUrl, PitchforkAlbum } from '../models/';
import { PitchforkService, YoutubeService } from '../services/';
import { TrackType } from '../enums/tracktype';
import * as _ from 'lodash';

export class TrackService {

    public static count = 0;

    public static validateAndCreateAlbum(tracks: MusicTrack[]): Promise<PitchforkAlbum> {

        return new Promise<PitchforkAlbum>((resolve, reject) => {
        let promises : Promise<DownloadUrl>[] = [];
        
            
            _.forEach(tracks, track => {
                if (_.isNil(track.DownloadUrl) || _.isNil(track.DownloadUrl.Location) || track.DownloadUrl.Location == "") {
                    promises.push(TrackService.getDownloadUrlForTrack(track)
                    .then(downloadUrl => {
                        track.DownloadUrl = downloadUrl;
                        return downloadUrl;
                    })
                    .catch(err => {
                        console.log("Unable to retrieve downloadURL: ", err);
                        return new DownloadUrl("");
                        //return null;
                    }));
                }
            });

            Promise.all(promises)
            .then(() => {
                resolve(new PitchforkAlbum("TestAlbum", "10-25-2017", tracks));
                //construct album here?
                //resolve(tracks);
            })
            .catch(err => {
                console.log("Error while getting remaining download urls");
                reject(err);
            })
        });
    }

    private static async getDownloadUrlForTrack(track: MusicTrack) : Promise<DownloadUrl>  {
        if (track.TrackType == TrackType.PITCHFORK_TRACK) {
            try {
                let downloadUrl = await PitchforkService.getDownloadUrlFromTrackReview(track);
                return downloadUrl;
            }
            catch(err) {
                //console.log(err);
            }
        }


        // if no valid download url on pitchfork, or is non-pitchfork track, then search youtube
        let downloadUrl = await YoutubeService.getYoutubeUrlForTrack(track);
        return downloadUrl;
    }

    public static ensureTracksAreNumbered = (tracks: MusicTrack[]) : MusicTrack[] =>  {
        let count = 0;
        _.forEach(tracks, track => {
            count++;
            if (_.isNil(track.TrackNumber)) {
                track.TrackNumber = (count < 10) ? "0" + count.toString() : count.toString();
            }
        })
        return tracks;

    }

}