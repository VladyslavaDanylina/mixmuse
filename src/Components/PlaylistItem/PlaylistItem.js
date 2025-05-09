import React from "react";
import './PlaylistItem.css';

export default class PlaylistItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { onSelect, playlistId } = this.props;
    if (onSelect && playlistId) {
      onSelect(playlistId);
    }
  }

  render() {
    return (
      <div className="PlaylistItem" onClick={this.handleClick}>
        <h3>{this.props.name}</h3>
      </div>
    );
  }
}
