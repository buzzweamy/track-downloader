
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
        id: string;
        bnm: boolean;
        artist_name: string;
        title: string;
        provider_data: ProviderData;
        audio_file?: any;
        audio_file_name?: any;
        availability: number;
        embed_code: string;
        artwork?: any;
        download_url: string;
        associated_content: string;
    }

    export interface List {
        subhead: string;
        abstract: string;
        seoDescription: string;
        promoDescription: string;
        socialDescription: string;
        authors: Author[];
        id: string;
        content_type: string;
        tags: any[];
        image: Image;
        pub_date: Date;
        timestamp: any;
        last_updated_date: Date;
        title: string;
        seo_title: string;
        socialTitle: string;
        promoTitle: string;
        url: string;
        tracks: Track[];
        artists: Artist[];
        bnm: boolean;
        genres: Genre[];
        audio_files: AudioFile[];
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

    


