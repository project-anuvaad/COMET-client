import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Annotate from "../../shared/components/Annotate";
import queryString from "query-string";
import {
  fetchImageById,
  updateImageGroups,
  updateImageStatus,
} from "../../actions/image";
import requestAgent from "../../shared/utils/requestAgent";
import api from "../../shared/api";

import { Button, Icon, Grid } from "semantic-ui-react";
import routes from "../../shared/routes";

class AnnotatePage extends React.Component {
  componentWillMount = () => {
    const { search } = this.props.history.location;
    const { image } = queryString.parse(search);
    this.props.fetchImageById(image);
  };

   getPixelColor = (params) =>
    new Promise((resolve, reject) => {
      requestAgent
        .get(api.image.getPixelColor(this.props.image._id, params))
        .then((res) => {
          const { color } = res.body;
          resolve({ color });
        })
        .catch(reject);
    });


  getColors = (params) =>
    new Promise((resolve, reject) => {
      requestAgent
        .get(api.image.getColors(this.props.image._id, params))
        .then((res) => {
          const { colors } = res.body;
          resolve({ colors });
        })
        .catch(reject);
    });

  getText = (params) =>
    new Promise((resolve, reject) => {
      console.log('getting text')
      requestAgent
        .get(api.image.getText(this.props.image._id, params))
        .then((res) => {
          const { text } = res.body;
          resolve({ text });
        })
        .catch(reject);
    });
  onChange = (changes) => {
    const { groups } = changes;
    this.props.updateImageGroups(this.props.image._id, groups);
  };

  onComplete = () => {
    this.props.updateImageStatus(this.props.image._id, "done");
  };

  render() {
    if (!this.props.image) return null;
    const { image } = this.props;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <div
                style={{
                  margin: "1rem 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <a href={routes.organizationImageAnnotation()}>
                  <Button basic circular size="small">
                    <Icon name="arrow left" />
                    Back to Images
                  </Button>
                </a>
                <Button
                  color="blue"
                  circular
                  size="small"
                  onClick={this.onComplete}
                >
                  Save & Complete
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Annotate
          // mode="translate"
          imageUrl={image.url}
          defaultGroups={image.groups}
          displayWidth={image.displayWidth}
          displayHeight={image.displayHeight}
          onChange={this.onChange}
          getColors={this.getColors}
          getPixelColor={this.getPixelColor}
          getText={this.getText}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ image }) => ({
  image: image.image,
});

const mapDispatchToProps = (dispatch) => ({
  fetchImageById: (id) => dispatch(fetchImageById(id)),
  updateImageGroups: (id, groups) => dispatch(updateImageGroups(id, groups)),
  updateImageStatus: (id, status) => dispatch(updateImageStatus(id, status)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AnnotatePage));
