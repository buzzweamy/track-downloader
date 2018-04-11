
    export interface Category {
        header: string;
        id?: any;
        name: string;
        bio: string;
        mobile_header: string;
        url: string;
    }

    export interface Author {
        id: string;
        name: string;
        title: string;
        url: string;
        slug: string;
    }

    export interface Image {
        default: string;
        large_module: string;
        homepage_large: string;
        list: string;
        small_module: string;
    }

    export interface Genre {
        display_name: string;
        slug: string;
    }

    export interface Image2 {
        m: string;
        sm: string;
    }

    export interface Label {
        id: string;
        name: string;
        display_name: string;
    }

    export interface Track {
        display_name: string;
        artists: Artist[];
        labels: Label[];
        release_year: number;
    }
	
	export interface Artist {
        id: string;
        name: string;
        slug: string;
        display_name: string;
        description: string;
        url: string;
        similar: any[];
        genres: Genre[];
        image: Image2;
        image_credit_url?: any;
        image_credit: string;
    }

    export interface ProviderData {
        track_id: number;
        downloadable?: number;
        buy_link: string;
    }

    export interface AudioFile {
        artwork?: any;
        associated_content: string;
        audio_file?: any;
        audio_file_name?: any;
        bnm: boolean;
        description: string;
        download_url: string;
        embedUrl: string;
        id: string;
        name: string;
        provider: string;
        provider_data: ProviderData;
        title: string;
        //artist_name: string;
        //availability: number;
        
        
        
        
    }

    export interface List {
        artists: Artist[];
        audio_files: AudioFile[];
        authors: Author[];
        bnm: boolean;
        contentType: string;
        genres: Genre[];
        id: string;
        modifiedAt: Date;
        promoDescription: string;
        promoTitle: string;
        pubDate: Date;
        seoDescription: string;
        seoTitle: string;
        socialDescription: string;
        socialTitle: string;
        subhead: string;
        tags: any[];
        timestamp: number;
        title: string;
        tracks: Track[];
        url: string;
        
        //abstract: string;
        //image: Image;
        //last_updated_date: Date;
        
    }

    export interface Results {
        category: Category;
        list: List[];
    }

    export interface RootObject {
        count: number;
        previous?: any;
        next?: any;
        results: Results;
    }

    


