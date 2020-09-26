import React from "react";
import { connect } from "react-redux";
import {
  fetchImageById,
  fetchImageTranslationExports,
  setTranslationExportsCurrentPage,
} from "../../../../../actions/image";

import { Grid } from "semantic-ui-react";

import "./style.scss";
import TranslationExportCard from "./TranslationExportCard";
import ClearPagination from "../../../../../shared/components/ClearPagination";

class ExportHistory extends React.Component {
  state = {
    currentPage: 1,
  };
  componentWillMount = () => {
    this.props.fetchImageTranslationExports(this.props.imageId);
    this.fetchInterval = setInterval(() => {
      this.props.fetchImageTranslationExports(this.props.imageId);
    }, 5000);
  };

  componentWillUnmount = () => {
    if (this.fetchInterval) {
      clearInterval(this.fetchInterval);
    }
  };

  onPageChange = (_, data) => {
    const { activePage } = data;
    this.props.setTranslationExportsCurrentPage(activePage);
    this.props.fetchImageTranslationExports(this.props.imageId);
  };

  render() {
    const { imageTranslationExports } = this.props;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <ClearPagination
                  activePage={this.props.translationExportsCurrentPage}
                  totalPages={this.props.translationExportsTotalPages}
                  onPageChange={this.onPageChange}
                />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {imageTranslationExports.map((i) => (
              <Grid.Column
                width={4}
                key={i._id}
                style={{ marginBottom: "2rem" }}
              >
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
  translationExportsCurrentPage: image.translationExportsCurrentPage,
  translationExportsTotalPages: image.translationExportsTotalPages,
});

const mapDispatchToProps = (dispatch) => ({
  fetchImageTranslationExports: (imageId) =>
    dispatch(fetchImageTranslationExports(imageId)),
  setTranslationExportsCurrentPage: (page) =>
    dispatch(setTranslationExportsCurrentPage(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportHistory);
