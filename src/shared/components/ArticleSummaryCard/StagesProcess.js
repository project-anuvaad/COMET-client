import React from "react";
import PropTypes from "prop-types";
import { ARTICLE_STAGES, ARTICLE_STAGES_TITLES } from "../../constants";
import { Icon } from "semantic-ui-react";

export default class StagesProcess extends React.Component {
  render() {
    const { activeStage } = this.props;
    const stagesArray = Object.keys(ARTICLE_STAGES).map(
      (k) => ARTICLE_STAGES[k]
    );
    const activeStageIndex = stagesArray.indexOf(activeStage);
    return (
      <div>
        {Object.keys(ARTICLE_STAGES).map((stage, index) => (
          <div
            key={`stage-process-${stage}`}
            style={{ position: "relative", marginBottom: 10 }}
          >
            {index === activeStageIndex && (
              <Icon
                name="ellipsis horizontal"
                circular
                style={{ color: "white", backgroundColor: "orange" }}
                size="tiny"
              />
            )}
            {index < activeStageIndex && (
              <Icon
                name="check"
                circular
                style={{ color: "white", backgroundColor: "green" }}
                size="tiny"
              />
            )}
            {index > activeStageIndex && (
              <Icon
                name="check"
                circular
                style={{ color: "transparent", backgroundColor: "#d4e0ed" }}
                size="tiny"
              />
            )}
            {index !== 0 && (
              <div
                style={{
                  position: "absolute",
                  width: 1,
                  height: 18,
                  top: -12,
                  left: 6,
                  zIndex: -1,
                  background: index < activeStageIndex ? "green" : "#d4e0ed",
                }}
              ></div>
            )}
            {ARTICLE_STAGES_TITLES[ARTICLE_STAGES[stage]]}
          </div>
        ))}
      </div>
    );
  }
}

StagesProcess.propTypes = {
  stages: PropTypes.object,
  activeStage: PropTypes.string,
};
