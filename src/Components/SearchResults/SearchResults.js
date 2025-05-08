import React from "react";
import TrackList from "../TrackList/TrackList";
import "./SearchResults.css";

export default class SearchResults extends React.Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList
  tracks={this.props.searchResults}
  onAdd={this.props.onAdd}
  isRemoval={false}
  onPlay={this.props.onPlay} // 👈 Add this
/>
      </div>
    );
  }
}
