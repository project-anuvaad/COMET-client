import React from "react";
import {
  Grid,
  Button,
  Input,
  Form,
  Icon,
  TextArea,
  Popup,
  Card,
} from "semantic-ui-react";
import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import ColorPickerModal from "./ColorPickerModal";
import DeleteShapeModal from "./DeleteShapeModal";
import {
  ACTION_BUTTONS,
  FONT_WEIGHT_BUTTONS,
  FONT_STYLE_BUTTONS,
  TEXT_DECORATION_BUTTONS,
  CANVAS_OPTIONS,
  OBJECTS_OPTIONS,
} from "./utils/constants";
import { rgbToHex } from "./utils/helpers";
import "semantic-ui-css/semantic.min.css";
import "./style.scss";

let canvas,
  currentObj = {},
  currentGroup = {};

class Annotate extends React.Component {
  state = {
    canvas: null,
    getTextLoading: false,
    groups: [],
    selectedGroupId: null,
    text: "",
    textChanged: false,
    fontSize: 12,
    colorType: "text",
    isColorPickerModalOpen: false,
    isDeleteShapeModalOpen: false,
    selectedTextColor: "",
    selectedBackgroundColor: "",
    actionStatus: null,
    fontWeightStatus: null,
    fontStyleStatus: null,
    textDecorationStatus: null,
    presetColors: [],
    mouseDown: false,
    mouseMove: false,
    objectNotSelected: true,
    color: "#000000",
  };

  componentDidMount() {
    this.init(this.props.imageUrl, this.props.defaultGroups);
  }

  init = (image, groups) => {
    const { displayWidth, displayHeight } = this.props;
    const self = this;
    fabric.Image.fromURL(image, (oImg) => {
      oImg.selectable = false;
      canvas = new fabric.Canvas("canvas", CANVAS_OPTIONS);
      if (displayWidth) {
        oImg.setWidth(displayWidth);
      }
      if (displayHeight) {
        oImg.setHeight(displayHeight);
      }
      canvas.setWidth(oImg.width);
      canvas.setHeight(oImg.height);
      canvas.setBackgroundImage(oImg);
      self.setState({
        actionStatus: ACTION_BUTTONS.selection,
      });
      self.onObjectSelected();
      self.onSelectionCleared();
      self.onObjectModified();
      self.getCoordinates();
      canvas.renderAll();
      if (groups) {
        setTimeout(() => self.setInintialGroups(groups), 100);
      }
    });
  };

  setInintialGroups = (groups) => {
    const addedGroups = [];
    groups.forEach((group) => {
      const groupObjects = [];
      group.objects.forEach((object) => {
        switch (object.type) {
          case "circle":
            const circle = new fabric.Circle({
              ...object,
            });
            groupObjects.push(circle);
            break;
          case "rect":
            const rect = new fabric.Rect({
              ...object,
            });
            groupObjects.push(rect);
            break;
          case "text":
            const text = new fabric.Text(object.text || "", {
              ...object,
            });
            groupObjects.push(text);
            break;
          default:
            break;
        }
      });
      const { objects, ...rest } = group;
      const addedGroup = new fabric.Group(groupObjects, {
        ...rest,
        uniqueId: uuidv4(),
      });
      // Include uniqueId in toObject calls
      addedGroup.toObject = (function (toObject) {
        return function () {
          return fabric.util.object.extend(toObject.call(this), {
            uniqueId: this.uniqueId,
            _id: this._id,
          });
        };
      })(addedGroup.toObject);
      addedGroups.push(addedGroup);
      canvas.add(addedGroup);
    });
    if (addedGroups && addedGroups[0]) {
      canvas.setActiveObject(addedGroups[0]);
      this.setState({
        groups: addedGroups,
        selectedGroupId: addedGroups[0].uniqueId,
      });
    } else {
      this.setState({ groups: [] });
    }
    canvas.renderAll();
    // const initialGroups = groups;
    // if (initialGroups) {
    //   fabric.util.enlivenObjects(initialGroups, function (groups) {
    //     groups.forEach(function (group) {
    //       group.toObject = (function (toObject) {
    //         return function () {
    //           return fabric.util.object.extend(toObject.call(this), {
    //             uniqueId: this.uniqueId,
    //           });
    //         };
    //       })(group.toObject);
    //       group.set({ selectable: false });
    //       canvas.add(group);
    //     });
    //     canvas.renderAll();
    //     console.log(canvas.toObject().objects)
    //     self.setState({ groups: canvas.toObject().objects });
    //   });
    // }
  };
  getCoordinates = () => {
    const self = this;
    let startPoints = {};
    canvas
      .on("mouse:down", function (o) {
        if (!self.state.objectNotSelected) return false;

        self.setState({ mouseDown: true });
        startPoints = canvas.getPointer(o.e);

        if (Object.keys(currentObj).length) {
          currentObj["obj"].set({
            originX: "center",
            originY: "center",
            selectable: false,
          });
          currentObj["obj"].setCoords();
          const text = new fabric.Text("", {
            fontSize: 12,
            originX: "center",
            originY: "center",
            selectable: false,
          });
          text.setCoords();
          currentGroup = new fabric.Group([currentObj["obj"], text], {
            left: startPoints.x,
            top: startPoints.y,
            selectable: true,
          });
          currentGroup.setCoords();
          currentGroup.toObject = (function (toObject) {
            return function () {
              return fabric.util.object.extend(toObject.call(this), {
                uniqueId: this.uniqueId,
                _id: this._id,
              });
            };
          })(currentGroup.toObject);
          currentGroup.uniqueId = uuidv4();
          canvas.add(currentGroup);
          canvas.isDrawingMode = false;
          canvas.renderAll();
        } else {
          self.setState({ actionStatus: ACTION_BUTTONS.rectangle });
          self.makeSelectableDisable();
          self.createRectangle();

          currentObj["obj"].set({
            originX: "center",
            originY: "center",
            selectable: false,
          });
          currentObj["obj"].setCoords();
          const text = new fabric.Text("", {
            fontSize: 12,
            originX: "center",
            originY: "center",
            selectable: false,
          });
          text.setCoords();
          currentGroup = new fabric.Group([currentObj["obj"], text], {
            left: startPoints.x,
            top: startPoints.y,
            selectable: true,
          });
          currentGroup.setCoords();
          currentGroup.toObject = (function (toObject) {
            return function () {
              return fabric.util.object.extend(toObject.call(this), {
                uniqueId: this.uniqueId,
                _id: this._id,
              });
            };
          })(currentGroup.toObject);
          currentGroup.uniqueId = uuidv4();
          canvas.isDrawingMode = false;
          canvas.add(currentGroup);
          canvas.renderAll();
        }
      })
      .on("mouse:move", function (o) {
        if (!self.state.mouseDown || !self.state.objectNotSelected)
          return false;
        if (self.state.mouseDown && !canvas.getActiveObject()) {
          self.setState({ mouseMove: true });
        }
        if (Object.keys(currentObj).length && currentObj["type"]) {
          canvas.isDrawingMode = false;
          const movingPoints = canvas.getPointer(o.e);

          if (movingPoints.x - startPoints.x < 0) {
            currentObj["obj"].set({
              left: startPoints.x + (movingPoints.x - startPoints.x),
            });
          }

          if (movingPoints.y - startPoints.y < 0) {
            currentObj["obj"].set({
              top: startPoints.y + (movingPoints.y - startPoints.y),
            });
          }

          if (currentObj["type"] === "rect") {
            currentObj["obj"].set({
              width: Math.abs(movingPoints.x - startPoints.x),
              height: Math.abs(movingPoints.y - startPoints.y),
            });
            currentObj["obj"].setCoords();
          } else if (currentObj["type"] === "circle") {
            currentObj["obj"].set({
              radius: Math.abs(movingPoints.x - startPoints.x) / 2,
            });
            currentObj["obj"].setCoords();
          } else if (currentObj["type"] === "oval") {
            currentObj["obj"].set({
              rx: Math.abs(movingPoints.x - startPoints.x) / 2,
              ry: Math.abs(movingPoints.y - startPoints.y) / 2,
            });
            currentObj["obj"].setCoords();
          } else if (currentObj["type"] === "line") {
            currentObj["obj"].set({
              x2: movingPoints.x,
              y2: movingPoints.y,
            });
            currentObj["obj"].setCoords();
          }

          currentObj["obj"].set({ top: 0, left: 0 });
          currentObj["obj"].setCoords();
          currentGroup.set({
            width: currentObj["obj"].width,
            height: currentObj["obj"].height,
            selectable: true,
          });
          currentGroup.setCoords();
          canvas.renderAll();
        }
      })
      .on("mouse:up", function (o) {
        self.setState({ mouseDown: false });
        if (Object.keys(currentObj).length) {
          if (
            (currentObj["obj"].width === 0 || currentObj["obj"].height === 0) &&
            !canvas.getActiveObject()
          ) {
            canvas.remove(canvas.item(canvas.toObject().objects.length - 1));
            canvas.renderAll();
            const groups = canvas.toObject().objects;
            self.props.onChange({ groups });
            self.setState({
              actionStatus: ACTION_BUTTONS.rectangle,
              groups,
            });
            return;
          } else {
            if (!self.state.mouseMove) {
              currentObj["fun"]();
              return false;
            }
            currentObj["fun"]();
            canvas.isDrawingMode = false;
            canvas.renderAll();
            const groups = canvas.toObject().objects;
            self.props.onChange({ groups });
            self.setState({
              groups,
              actionStatus: ACTION_BUTTONS.selection,
              mouseMove: false,
            });
            self.cropImageAndExractColors();
            self.cropImageAndExtractText();
          }
        }
      });
  };

  cropImageAndExtractText = () => {
    const ao = canvas.getActiveObject();
    if (ao) {
      const left = canvas.getActiveObject().left;
      const top = canvas.getActiveObject().top;
      const width = canvas.getActiveObject().width;
      const height = canvas.getActiveObject().height;
      const angle = canvas.getActiveObject().angle;
      const groupId = canvas.getActiveObject().uniqueId;
      this.setState({ getTextLoading: true })
      this.props
        .getText({ left, top, width, height, angle })
        .then(({ text }) => {
          if (!text) return;
          const groupIndex = canvas
            .toObject()
            .objects.findIndex((group) => group.uniqueId === groupId);
          console.log("got text", text);
          canvas.item(groupIndex).item(1).set({ text});
          canvas.renderAll();
          const groups = canvas.toObject().objects;
          this.props.onChange({ groups })
          this.setState({ getTextLoading: false, text, groups });
        })
        .catch((err) => {
          this.setState({ getTextLoading: false })
          console.log(err);
        });
    }
  };

  cropImageAndExractColors = () => {
    const ao = canvas.getActiveObject();
    if (ao) {
      const url = this.props.imageUrl;
      const left = canvas.getActiveObject().left;
      const top = canvas.getActiveObject().top;
      const width = canvas.getActiveObject().width;
      const height = canvas.getActiveObject().height;
      const angle = canvas.getActiveObject().angle;
      const groupId = canvas.getActiveObject().uniqueId;

      this.props
        .getColors({ left, top, width, height, angle })
        .then(({ colors }) => {
          if (!colors && !Array.isArray(colors)) return;
          const hexColors = [];
          colors.forEach((rgb) => {
            hexColors.push(rgbToHex(rgb));
          });
          // let groupsColors;
          // groupsColors = JSON.parse(localStorage.getItem("colors")) || [];
          // const groupColors = groupsColors.find((gc) => gc.groupId === groupId);
          // if (groupColors) {
          //   groupColors.hexColors = hexColors;
          // }
          // groupsColors.push({ groupId, hexColors });
          // localStorage.setItem("colors", JSON.stringify(groupsColors));
          const groupIndex = canvas
            .toObject()
            .objects.findIndex((group) => group.uniqueId === groupId);
          canvas.item(groupIndex).item(0).set({ fill: hexColors[0] });
          canvas.item(groupIndex).item(1).set({ fill: hexColors[1] });
          this.setState({ selectedTextColor: hexColors[1] });
          this.setState({ selectedBackgroundColor: hexColors[0] });
          canvas.renderAll();
        })
        .catch((err) => {
          console.log(err);
        });
      // fetch(
      //   `http://localhost:5000/getColors?groupId=${groupId}&url=${url}&left=${left}&top=${top}&width=${width}&height=${height}&angle=${angle}`
      // )
      //   .then((res) => res.json())
      //   .then(
      //     (result) => {
      //       const { groupId, colors } = result;
      //       const hexColors = [];
      //       colors.forEach((rgb) => {
      //         hexColors.push(rgbToHex(rgb));
      //       });
      //       let groupsColors;
      //       groupsColors = JSON.parse(localStorage.getItem("colors")) || [];
      //       const groupColors = groupsColors.find(
      //         (gc) => gc.groupId === groupId
      //       );
      //       if (groupColors) {
      //         groupColors.hexColors = hexColors;
      //       }
      //       groupsColors.push({ groupId, hexColors });
      //       localStorage.setItem("colors", JSON.stringify(groupsColors));
      //       const groupIndex = canvas
      //         .toObject()
      //         .objects.findIndex((group) => group.uniqueId === groupId);
      //       canvas.item(groupIndex).item(0).set({ fill: hexColors[0] });
      //       canvas.item(groupIndex).item(1).set({ fill: hexColors[1] });
      //       this.setState({ selectedTextColor: hexColors[1] });
      //       this.setState({ selectedBackgroundColor: hexColors[0] });
      //       canvas.renderAll();
      //       localStorage.setItem(
      //         "initialGroups",
      //         JSON.stringify(canvas.toObject().objects)
      //       );
      //     },
      //     (error) => {
      //       console.log(error);
      //     }
      //   );
    }
  };

  onRectClick = () => {
    this.setState({ actionStatus: ACTION_BUTTONS.rectangle });
    this.makeSelectableDisable();
    this.createRectangle();
  };

  createRectangle = () => {
    canvas.isDrawingMode = false;
    currentObj["type"] = "rect";
    currentObj["fun"] = this.createRectangle;
    currentObj["obj"] = new fabric.Rect({
      stroke: OBJECTS_OPTIONS.defaultStrokeColor,
      fill: OBJECTS_OPTIONS.defaultFillColor,
      strokeWidth: OBJECTS_OPTIONS.defaultStrokeWidth,
      selectable: false,
      opacity: 0.8,
    });
  };

  onCircleClick = () => {
    this.setState({ actionStatus: ACTION_BUTTONS.circle });
    this.makeSelectableDisable();
    this.createCircle();
  };

  createCircle = () => {
    canvas.isDrawingMode = false;
    currentObj["type"] = "circle";
    currentObj["fun"] = this.createCircle;
    currentObj["obj"] = new fabric.Circle({
      stroke: OBJECTS_OPTIONS.defaultStrokeColor,
      fill: OBJECTS_OPTIONS.defaultFillColor,
      strokeWidth: OBJECTS_OPTIONS.defaultStrokeWidth,
      selectable: false,
      opacity: 0.8,
    });
  };

  onOvalClick = () => {
    this.setState({ actionStatus: ACTION_BUTTONS.oval });
    this.makeSelectableDisable();
    this.createOval();
  };

  createOval = () => {
    canvas.isDrawingMode = false;
    currentObj["type"] = "oval";
    currentObj["fun"] = this.createOval;
    currentObj["obj"] = new fabric.Ellipse({
      stroke: OBJECTS_OPTIONS.defaultStrokeColor,
      fill: OBJECTS_OPTIONS.defaultFillColor,
      strokeWidth: OBJECTS_OPTIONS.defaultStrokeWidth,
      selectable: false,
      opacity: 0.8,
    });
  };

  onTextChange = (value) => {
    canvas.getActiveObject().item(1).set({ text: value });
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    this.setState({ text: value, groups, textChanged: true });
  };

  onTextBlur = () => {
    const groups = canvas.toObject().objects;
    this.props.onChange({ groups });
    this.setState({ textChanged: false });
  };

  onFontSizeChange = (value) => {
    this.setState({
      fontSize: parseInt(value),
    });
    canvas
      .getActiveObject()
      .item(1)
      .set({ fontSize: parseInt(value) || 12 });
    canvas.renderAll();
  };

  toggleFontWeight = () => {
    if (this.state.fontWeightStatus === "bold") {
      this.setState({
        fontWeightStatus: FONT_WEIGHT_BUTTONS.noraml,
      });
      canvas.getActiveObject().item(1).set({ fontWeight: "normal" });
    } else {
      this.setState({
        fontWeightStatus: FONT_WEIGHT_BUTTONS.bold,
      });
      canvas.getActiveObject().item(1).set({ fontWeight: "bold" });
    }
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    this.props.onChange({ groups });
  };

  toggleTextDecoration = () => {
    if (this.state.textDecorationStatus === "underline") {
      this.setState({
        textDecorationStatus: TEXT_DECORATION_BUTTONS.normal,
      });
      canvas.getActiveObject().item(1).set({ textDecoration: "normal" });
    } else {
      this.setState({
        textDecorationStatus: TEXT_DECORATION_BUTTONS.underline,
      });
      canvas.getActiveObject().item(1).set({ textDecoration: "underline" });
    }
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    this.props.onChange({ groups });
  };

  toggleFontStyle = () => {
    if (this.state.fontStyleStatus === "italic") {
      this.setState({
        fontStyleStatus: FONT_STYLE_BUTTONS.normal,
      });
      canvas.getActiveObject().item(1).set({ fontStyle: "normal" });
    } else {
      this.setState({
        fontStyleStatus: FONT_STYLE_BUTTONS.italic,
      });
      canvas.getActiveObject().item(1).set({ fontStyle: "italic" });
    }
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    this.props.onChange({ groups });
  };

  onColorPickerOpen = (colorType) => {
    let color;
    if (colorType === "text") {
      color = canvas.getActiveObject().item(1).get("fill");
    } else if (colorType === "background") {
      color = canvas.getActiveObject().item(0).get("fill");
    }
    this.setState({
      isColorPickerModalOpen: true,
      colorType,
      color,
    });
  };

  onBoxSelected = (i) => {
    canvas.setActiveObject(canvas.item(i));
    const ao = canvas.getActiveObject();
    this.setState({
      text: ao.item(1).text,
      selectedGroupId: ao.get("uniqueId"),
      fontSize: ao.item(1).get("fontSize"),
      selectedTextColor: ao.item(1).fill,
      selectedBackgroundColor: ao.item(0).fill,
    });
  };

  onDeleteBoxClick = () => {
    this.setState({ isDeleteShapeModalOpen: true });
  };

  onSelectionClick = () => {
    canvas.isDrawingMode = false;
    this.setState({
      actionStatus: ACTION_BUTTONS.selection,
    });
    this.makeSelectableEnable();
  };

  onSaveImage = () => {
    this.setState({ actionStatus: ACTION_BUTTONS.save });
    localStorage.setItem(
      "initialGroups",
      JSON.stringify(canvas.toObject().objects)
    );
  };

  makeSelectableEnable = () => {
    canvas.getObjects().map(function (o) {
      return o.set("selectable", true);
    });
  };

  makeSelectableDisable = () => {
    canvas.getObjects().map(function (o) {
      return o.set("selectable", false);
    });
  };

  onObjectSelected = () => {
    const self = this;
    canvas.on("object:selected", function () {
      const ao = canvas.getActiveObject();
      if (ao) {
        self.setState({ objectNotSelected: false });
        // const groupColors = JSON.parse(localStorage.getItem("colors")).find(
        //   (groupColors) => groupColors.groupId === ao.uniqueId
        // );
        // const presetColors = groupColors ? groupColors.hexColors : [];
        self.setState({
          // presetColors,
          text: ao.item(1).text,
          selectedGroupId: ao.get("uniqueId"),
          fontSize: ao.item(1).get("fontSize"),
          selectedTextColor: ao.item(1).fill,
          selectedBackgroundColor: ao.item(0).fill,
          fontWeightStatus: FONT_WEIGHT_BUTTONS[ao.item(1).get("fontWeight")]
            ? FONT_WEIGHT_BUTTONS[ao.item(1).get("fontWeight")]
            : FONT_WEIGHT_BUTTONS.normal,
          fontStyleStatus: FONT_STYLE_BUTTONS[ao.item(1).get("fontStyle")]
            ? FONT_STYLE_BUTTONS[ao.item(1).get("fontStyle")]
            : FONT_STYLE_BUTTONS.normal,
          textDecorationStatus: TEXT_DECORATION_BUTTONS[
            ao.item(1).get("textDecoration")
          ]
            ? TEXT_DECORATION_BUTTONS[ao.item(1).get("textDecoration")]
            : TEXT_DECORATION_BUTTONS.normal,
        });
      }
    });
  };

  onSelectionCleared = () => {
    const self = this;
    canvas.on("selection:cleared", function (options) {
      self.setState({ selectedGroupId: null, objectNotSelected: true });
    });
  };

  onObjectModified = () => {
    const self = this;
    canvas.on("object:modified", function () {
      self.cropImageAndExractColors();
      const groups = canvas.toObject().objects;
      self.props.onChange({ groups });
    });
  };

  changeSelectedGroupColor = (colorType, color) => {
    if (colorType === "text") {
      this.setState({ color: color.hex, selectedTextColor: color });
      canvas.getActiveObject().item(1).set({
        fill: color,
      });
    } else if (colorType === "background") {
      this.setState({
        color: color,
        selectedBackgroundColor: color,
      });
      canvas.getActiveObject().item(0).set({
        fill: color,
      });
    }
    canvas.renderAll();
  };

  _renderColorPickerModal() {
    if (!this.state.isColorPickerModalOpen) return null;
    // const groupColors = JSON.parse(localStorage.getItem("colors")).find(
    //   (groupColors) => groupColors.groupId === canvas.getActiveObject().uniqueId
    // );
    // const presetColors = groupColors ? groupColors.hexColors : [];
    return (
      <ColorPickerModal
        open={this.state.isColorPickerModalOpen}
        onClose={() => {
          this.setState({ isColorPickerModalOpen: false });
        }}
        onChangeComplete={(color) => {
          this.changeSelectedGroupColor(this.state.colorType, color.hex);
          const groups = canvas.toObject().objects;
          this.props.onChange({ groups });
        }}
        color={this.state.color}
        // presetColors={presetColors}
      />
    );
  }

  _renderDeleteShapeModal() {
    return (
      <DeleteShapeModal
        open={this.state.isDeleteShapeModalOpen}
        onClose={() => {
          this.setState({ isDeleteShapeModalOpen: false });
        }}
        onConfirm={() => {
          canvas.remove(canvas.getActiveObject());
          this.onRectClick();
          // localStorage.setItem(
          //   "initialGroups",
          //   JSON.stringify(canvas.toObject().objects)
          // );
          const groups = canvas.toObject().objects;

          this.props.onChange({ groups });
          this.setState({
            groups,
            isDeleteShapeModalOpen: false,
          });
        }}
      />
    );
  }

  render() {
    let selectedGroupIndex;
    if (canvas) {
      selectedGroupIndex = canvas
        .getObjects()
        .indexOf(canvas.getActiveObject());
    }

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <div className="tools-container">
              <div className="shapes-container">
                <Button
                  fluid
                  primary={this.state.actionStatus === ACTION_BUTTONS.selection}
                  onClick={this.onSelectionClick}
                >
                  Selection
                </Button>
                <Button
                  className="rect"
                  fluid
                  primary={this.state.actionStatus === ACTION_BUTTONS.rectangle}
                  onClick={this.onRectClick}
                >
                  Rectangle
                </Button>
                <Button
                  className="circle"
                  fluid
                  primary={this.state.actionStatus === ACTION_BUTTONS.circle}
                  onClick={this.onCircleClick}
                >
                  Circle
                </Button>
                <Button
                  id="oval"
                  className="oval"
                  fluid
                  primary={this.state.actionStatus === ACTION_BUTTONS.oval}
                  onClick={this.onOvalClick}
                >
                  Oval
                </Button>
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="image-container">
              <canvas id="canvas"></canvas>
            </div>
          </Grid.Column>
          <Grid.Column width={6}>
            <div className="text-box-container">
              {this.state.selectedGroupId ? (
                <React.Fragment>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <Card fluid>
                          <Card.Header
                            style={{
                              backgroundColor: "rgb(212, 224, 237)",
                              borderRadius: 0,
                              height: 50,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h4 style={{ padding: "1rem" }}>
                              Box {selectedGroupIndex + 1}
                            </h4>
                            <div>
                              <Button
                                loading={this.state.getTextLoading}
                                disabled={this.state.getTextLoading}
                                color="blue"
                                icon="refresh"
                                onClick={this.cropImageAndExtractText}
                                basic
                              />
                              <Button
                                primary
                                basic
                                disabled={!this.state.textChanged}
                                onClick={this.onTextBlur}
                              >
                                Update
                              </Button>
                            </div>
                          </Card.Header>
                          <div>
                            <div style={{ height: 150 }}>
                              <TextArea
                                disabled={this.state.getTextLoading}
                                style={{
                                  height: "100%",
                                  width: "100%",
                                  padding: "1rem",
                                  border: "none",
                                }}
                                placeholder="Text goes here..."
                                value={this.state.text}
                                onBlur={this.onTextBlur}
                                onChange={(e, { value }) => {
                                  this.onTextChange(value);
                                }}
                              />
                            </div>
                          </div>
                        </Card>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={8}>
                              <Grid>
                                <Grid.Row>
                                  <Grid.Column width={6}>
                                    <strong>Font Size:</strong>
                                  </Grid.Column>
                                  <Grid.Column width={10}>
                                    <Input
                                      fluid
                                      style={{ width: "5rem" }}
                                      size="mini"
                                      type="number"
                                      min="1"
                                      value={this.state.fontSize}
                                      onChange={(e, { value }) => {
                                        this.onFontSizeChange(value);
                                      }}
                                    />
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                  <Grid.Column width={6}>
                                    <div>
                                      <strong>Style:</strong>
                                    </div>
                                  </Grid.Column>
                                  <Grid.Column width={10}>
                                    <Button
                                      size="mini"
                                      basic
                                      primary={
                                        this.state.fontWeightStatus ===
                                        FONT_WEIGHT_BUTTONS.bold
                                      }
                                      onClick={this.toggleFontWeight}
                                    >
                                      <Icon name="bold" />
                                    </Button>
                                    <Button
                                      size="mini"
                                      basic
                                      primary={
                                        this.state.fontStyleStatus ===
                                        FONT_STYLE_BUTTONS.italic
                                      }
                                      onClick={this.toggleFontStyle}
                                    >
                                      <Icon name="italic" />
                                    </Button>
                                    <Button
                                      size="mini"
                                      basic
                                      primary={
                                        this.state.textDecorationStatus ===
                                        TEXT_DECORATION_BUTTONS.underline
                                      }
                                      onClick={this.toggleTextDecoration}
                                    >
                                      <Icon name="underline" />
                                    </Button>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                  <Grid.Column width={6}>
                                    Text Color:
                                  </Grid.Column>
                                  <Grid.Column width={10}>
                                    <Button
                                      style={{
                                        marginLeft: "1rem",
                                        backgroundColor: this.state
                                          .selectedTextColor,
                                        border: "1px solid black",
                                      }}
                                      onClick={() => {
                                        this.onColorPickerOpen("text");
                                      }}
                                    ></Button>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                  <Grid.Column width={6}>
                                    Background Color:
                                  </Grid.Column>
                                  <Grid.Column width={10}>
                                    <Button
                                      style={{
                                        marginLeft: "1rem",
                                        backgroundColor: this.state
                                          .selectedBackgroundColor,
                                        border: "1px solid black",
                                      }}
                                      onClick={() => {
                                        this.onColorPickerOpen("background");
                                      }}
                                    ></Button>
                                    <div>
                                      <Popup
                                        position="top center"
                                        trigger={
                                          <Button
                                            icon="refresh"
                                            role="Swap colors"
                                            basic
                                            style={{
                                              position: "absolute",
                                              top: "-2.5rem",
                                              right: 0,
                                            }}
                                            onClick={() => {
                                              // Swap colors of background and text
                                              const {
                                                selectedBackgroundColor,
                                                selectedTextColor,
                                              } = this.state;
                                              this.changeSelectedGroupColor(
                                                "text",
                                                selectedBackgroundColor
                                              );
                                              this.changeSelectedGroupColor(
                                                "background",
                                                selectedTextColor
                                              );
                                              const groups = canvas.toObject()
                                                .objects;
                                              this.props.onChange({
                                                groups,
                                              });
                                            }}
                                          />
                                        }
                                        content={"Swap Colors"}
                                      />
                                    </div>
                                  </Grid.Column>
                                </Grid.Row>
                              </Grid>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment></React.Fragment>
              )}
            </div>

            <div className="boxes-list-container">
              {this.state.groups.map((group, i) => (
                <div
                  style={{
                    borderColor:
                      this.state.selectedGroupId === group.uniqueId
                        ? "#2185d0"
                        : "#c6c6c6",
                  }}
                  className="box"
                  key={group.uniqueId || group._id}
                  onClick={() => {
                    this.onBoxSelected(i);
                  }}
                >
                  <div>Box {i + 1}</div>
                  {this.state.selectedGroupId === group.uniqueId && (
                    <Button
                      size="mini"
                      color="red"
                      icon="trash"
                      onClick={this.onDeleteBoxClick}
                    />
                  )}
                </div>
              ))}
            </div>
            {this._renderColorPickerModal()}
            {this._renderDeleteShapeModal()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Annotate;
