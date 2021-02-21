import React from 'react';
import BaseCard, {BaseCardProps, BaseCardState} from "../../../shared/components/baseCard/baseCard";
import classNames from 'classnames';
import DisplayedLanguage from "../../../models/language";
import handleViewport from 'react-in-viewport';
import { Artwork } from '../../../models/artwork';
import './artworkCard.css';
import { linkToString } from '../../../models/url';

enum ImageLoadingState {
    NotLoaded,
    Loading,
    Loaded,
}

interface ArtworkCardProps extends BaseCardProps<Artwork> {
}

interface ArtworkCardState extends BaseCardState {
    loadingState: ImageLoadingState,
}

export default class ArtworkCard extends BaseCard<Artwork, ArtworkCardProps, ArtworkCardState> {
    private readonly artwork: Artwork;
    private imageElement: HTMLImageElement;

    constructor(props: ArtworkCardProps) {
        super(props);
        this.artwork = props.object;
        this.imageElement = document.createElement("img");

        this.imageLoaded = this.imageLoaded.bind(this);
    }

    state: ArtworkCardState = {
        loadingState: ImageLoadingState.NotLoaded,
        inViewport: false // From BaseCardState
    }

    private imageLoaded() {
        this.setState({
            loadingState: ImageLoadingState.Loaded,
        });

        this.imageElement.removeEventListener("load", this.imageLoaded);
    }

    private setImage() {
        if (this.state.inViewport && this.state.loadingState === ImageLoadingState.NotLoaded) {
            this.imageElement.src = linkToString(this.artwork.artworkLink);
            this.imageElement.addEventListener("load", this.imageLoaded);

            this.setState({
                loadingState: ImageLoadingState.Loading,
            });
        }
    }

    componentDidMount() {
        // TODO: Is this the right place to set the state?
        this.setState({inViewport: true});
        this.setImage();
    }

    componentDidUpdate() {
        this.setImage();
    }

    renderArtwork() {
        const hasLoaded = this.state.loadingState === ImageLoadingState.Loaded;
        const artworkLink = linkToString(this.artwork.artworkLink);
        const artistLink = linkToString(this.artwork.artistLink);

        return (
            <div className="artwork-card">
                <div className="artwork-card-img">
                    <div className={classNames("placeholder", {
                        "loaded": hasLoaded,
                    })}></div>
                    <div className={classNames("image", {
                        "loaded": hasLoaded,
                    })}>
                        <img src={hasLoaded ? artworkLink : ""} alt={this.artwork.title} />
                    </div>
                </div>
                <div className="artwork-card-footer">
                    <div className="title">{this.artwork.title}</div>
                    <div className="artist"><a href={artistLink}>{this.artwork.username}</a></div>
                </div>
            </div>
        )
    }

    render() {
        return this.renderArtwork();
    }
}
