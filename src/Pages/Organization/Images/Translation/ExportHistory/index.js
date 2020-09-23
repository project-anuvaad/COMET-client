import React from "react";
import { connect } from "react-redux";
import {
  fetchImageById,
  fetchImageTranslationExports,
} from "../../../../../actions/image";

import { Grid } from "semantic-ui-react";

import  "./style.scss";
import TranslationExportCard from "./TranslationExportCard";

class ExportHistory extends React.Component {
  componentWillMount = () => {
      this.props.fetchImageTranslationExports(this.props.imageId)
      this.fetchInterval = setInterval(() => {
        this.props.fetchImageTranslationExports(this.props.imageId)
      }, 5000);
  };

  componentWillUnmount = () => {
      if (this.fetchInterval) {
          clearInterval(this.fetchInterval);
      }
  }

  render() {
      const { imageTranslationExports } = this.props;
    return (
      <div>
        <Grid>
          <Grid.Row>
              {imageTranslationExports.map(i => (
                  <Grid.Column width={4} key={i._id} style={{ marginBottom: '2rem' }}>
                    <TranslationExportCard imageTranslationExport={i} />
                  </Grid.Column>
              ))}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ image }) => ({
  image: image.image,
  imageTranslationExports: image.imageTranslationExports,
});

const mapDispatchToProps = (dispatch) => ({
    fetchImageTranslationExports: imageId => dispatch(fetchImageTranslationExports(imageId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory);
