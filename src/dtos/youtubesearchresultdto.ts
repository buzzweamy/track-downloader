export interface PageInfo {
	totalResults: number;
	resultsPerPage: number;
}

export interface Id {
	kind: string;
	videoId: string;
}

export interface Default {
	url: string;
	width: number;
	height: number;
}

export interface Medium {
	url: string;
	width: number;
	height: number;
}

export interface High {
	url: string;
	width: number;
	height: number;
}

export interface Thumbnail {
	default: Default;
	medium: Medium;
	high: High;
}

export interface Snippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: Thumbnail;
	channelTitle: string;
	liveBroadcastContent: string;
}

export interface Item {
	kind: string;
	etag: string;
	id: Id;
	snippet: Snippet;
}

export interface YoutubeSearchResultDto {
	kind: string;
	etag: string;
	nextPageToken: string;
	regionCode: string;
	pageInfo: PageInfo;
	items: Item[];
}