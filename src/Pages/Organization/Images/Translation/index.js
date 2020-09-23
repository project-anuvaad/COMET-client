import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Annotate from "../../../../shared/components/Annotate";
import {
  fetchImageById,
  updateImageGroups,
  exportImageTranslation,
  setTranslationActiveTabIndex,
} from "../../../../actions/image";
import requestAgent from "../../../../shared/utils/requestAgent";
import api from "../../../../shared/api";

import { Button, Icon, Grid } from "semantic-ui-react";
import ExportHistory from "./ExportHistory";
import routes from "../../../../shared/routes";

import styles from "./style.scss";
import Tabs from "../../../../shared/components/Tabs";

class Translate extends React.Component {
  componentWillMount = () => {
    const { imageId } = this.props.match.params;
    this.props.fetchImageById(imageId);
    this.props.setTranslationActiveTabIndex(0)
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
      console.log("getting text");
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

  onSendToExport = () => {
    this.props.exportImageTranslation(this.props.image._id);
  };

  getTabItems = () => {
    return [
      {
        title: "Workstation",
      },
      {
        title: "Export History",
      },
    ];
  };

  renderTabContent = () => {
    let comp;
    const { image } = this.props;

    switch (this.props.translationActiveTabIndex) {
      case 0:
        comp = (
          <Annotate
            mode="translate"
            imageUrl={image.url}
            defaultGroups={image.groups}
            displayWidth={image.displayWidth}
            displayHeight={image.displayHeight}
            onChange={this.onChange}
            getColors={this.getColors}
            getPixelColor={this.getPixelColor}
            getText={this.getText}
            originalText={image.originalText || []}
          />
        );
        break;
      case 1:
        comp = <ExportHistory imageId={image._id} />;
        break;
      default:
        comp = (
          <Annotate
            mode="translate"
            imageUrl={image.url}
            defaultGroups={image.groups}
            displayWidth={image.displayWidth}
            displayHeight={image.displayHeight}
            onChange={this.onChange}
            getColors={this.getColors}
            getPixelColor={this.getPixelColor}
            getText={this.getText}
          />
        );
        break;
    }
    return <div style={{ width: "100%", marginTop: "3rem" }}>{comp}</div>;
  };

  render() {
    if (!this.props.image) return null;
    const items = this.getTabItems();

    return (
      <div id="translation-container">
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
                <div>
                  <a href={routes.organizationImageTranslation()}>
                    <Button
                      basic
                      circular
                      icon="arrow left"
                      size="large"
                      id="back-btn"
                    />
                  </a>
                  <Tabs
                    items={items}
                    activeIndex={this.props.translationActiveTabIndex}
                    onActiveIndexChange={(val) => {
                      this.props.setTranslationActiveTabIndex(val);
                    }}
                  />
                </div>
                <Button
                  color="blue"
                  circular
                  size="small"
                  onClick={this.onSendToExport}
                >
                  Send to Export
                  <Icon name="arrow right" style={{ marginLeft: 10 }} />
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>{this.renderTabContent()}</Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ image }) => ({
  image: image.image,
  translationActiveTabIndex: image.translationActiveTabIndex,
});

const mapDispatchToProps = (dispatch) => ({
  setTranslationActiveTabIndex: (index) =>
    dispatch(setTranslationActiveTabIndex(index)),
  fetchImageById: (id) => dispatch(fetchImageById(id)),
  updateImageGroups: (id, groups) => dispatch(updateImageGroups(id, groups)),
  exportImageTranslation: (id) => dispatch(exportImageTranslation(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Translate));
