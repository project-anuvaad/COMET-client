import React from "react";
import {
  Grid,
  Button,
  Input,
  Icon,
  TextArea,
  Popup,
  Card,
  Dropdown,
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
//import FontFaceObserver from "fontfaceobserver";

function renderPopup(trigger, content) {
  return <Popup trigger={trigger} content={content} />;
}

let canvas,
  currentObj = {},
  currentGroup = {};

const FONTS_OPTIONS = ["Serif", "Sans Serif", "Arial", "Courier"];

class Annotate extends React.Component {
  state = {
    canvas: null,
    eyeDropperMode: "",
    eyeDropperLoading: false,
    getTextLoading: false,
    groups: [],
    selectedGroupId: null,
    selectedGroupIndex: 0,
    text: "",
    fontFamily: FONTS_OPTIONS[0],
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

  canModifyBoxes = () => this.props.mode !== "translate";

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
        setTimeout(() => {
          self.setInintialGroups(groups);
          if (self.canModifyBoxes()) {
            self.onRectClick();
          }
        }, 100);
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
          case "ellipse":
            const oval = new fabric.Ellipse({
              ...object,
            });
            groupObjects.push(oval);
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
        selectedGroupIndex: 0,
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
        if (self.state.eyeDropperMode) return false;
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
            fontFamily: FONTS_OPTIONS[0],
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
            fontFamily: FONTS_OPTIONS[0],
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
              });
            };
          })(currentGroup.toObject);
          currentGroup.uniqueId = uuidv4();
          canvas.isDrawingMode = false;
          canvas.add(currentGroup);
          canvas.renderAll();
          const groups = canvas.toObject().objects;
          self.setState({ groups });
          self.props.onChange({ groups });
        }
      })
      .on("mouse:move", function (o) {
        if (
          !self.state.mouseDown ||
          !self.state.objectNotSelected ||
          self.state.eyeDropperMode
        )
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
        console.log(self.state, Object.keys(currentObj).length);
        if (self.state.eyeDropperMode) {
          const { x, y } = canvas.getPointer(o.e);
          const { selectedGroupIndex } = self.state;
          canvas.setActiveObject(canvas.item(selectedGroupIndex));
          return self.setState({ eyeDropperLoading: true }, () => {
            self.extractEyeDropperPixelValue({ x, y });
          });
        }
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
            self.onSelectionStart();
            console.log("on selection stat");
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
            // self.cropImageAndExractColors();
            self.cropImageAndExtractText();
          }
        }
      });
  };

  onObjectSelected = () => {
    const self = this;
    canvas.on("object:selected", function () {
      if (self.state.eyeDropperMode) return false;
      const ao = canvas.getActiveObject();
      if (ao) {
        // const groupColors = JSON.parse(localStorage.getItem("colors")).find(
        //   (groupColors) => groupColors.groupId === ao.uniqueId
        // );
        // const presetColors = groupColors ? groupColors.hexColors : [];
        const groupId = ao.get("uniqueId");
        const groups = canvas.toObject().objects;
        const groupIndex = groups.findIndex((g) => g.uniqueId === groupId);
        self.setState({
          // presetColors,
          objectNotSelected: false,
          selectedGroupId: ao.get("uniqueId"),
          selectedGroupIndex: groupIndex,
          text: ao.item(1).text,
          fontFamily: ao.item(1).get("fontFamily"),
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
      if (self.state.eyeDropperMode) return;
      self.setState({ selectedGroupId: null, objectNotSelected: true });
    });
  };

  onObjectModified = () => {
    const self = this;

    canvas.on("object:modified", function (options) {
      const { target } = options;
      const width = target.getWidth();
      const height = target.getHeight();
      const left = target.getLeft();
      const top = target.getTop();
      const angle = target.getAngle();
      const scaleX = target.getScaleX();
      const scaleY = target.getScaleY();
      const ao = canvas.getActiveObject();
      const updatedProperties = {
        width,
        height,
        top,
        left,
        angle,
        scaleX: 1,
        scaleY: 1,
      };
      ao.set(updatedProperties);
      ao.item(0).set({ width, height });
      canvas.renderAll();

      const updatedGroups = canvas.toObject().objects;
      self.setState({ groups: updatedGroups });
      self.props.onChange({ groups: updatedGroups });
    });
    //    canvas.on("object:modified", function (options) {
    //      const { target } = options;
    //      console.log(target.toObject());
    //      const width = target.getWidth();
    //      const height = target.getHeight();
    //      const left = target.getLeft();
    //      const top = target.getTop();
    //      const ao = canvas.getActiveObject();
    //      if (ao) {
    //        const groupId = ao.get("uniqueId");
    //        const groups = canvas.toObject().objects;
    //        const groupIndex = groups.findIndex((g) => g.uniqueId === groupId);
    //        ao.set({ width, height, left, top });
    //        ao.item(0).set({ width, height });
    //        canvas.renderAll();
    //        const updatedGroups = canvas.toObject().objects;
    //        self.props.onChange({ groups: updatedGroups });
    //      }
    //    });
  };

  extractEyeDropperPixelValue = ({ x, y }) => {
    const { eyeDropperMode, selectedGroupIndex } = this.state;
    this.props
      .getPixelColor({ left: x, top: y })
      .then(({ color }) => {
        color = rgbToHex(color);

        if (eyeDropperMode === "background") {
          canvas.item(selectedGroupIndex).item(0).set({ fill: color });
          this.setState({ color, selectedBackgroundColor: color });
        } else {
          canvas.item(selectedGroupIndex).item(1).set({ fill: color });
          this.setState({ color, selectedTextColor: color });
        }
        canvas.renderAll();
        const groups = canvas.toObject().objects;
        this.setState({ eyeDropperMode: "", eyeDropperLoading: false, groups });
        this.props.onChange({ groups });
      })
      .catch((err) => {
        this.setState({ eyeDropperMode: "", eyeDropperLoading: false });
        console.log(err);
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
      this.setState({ getTextLoading: true });
      this.props
        .getText({ left, top, width, height, angle })
        .then(({ text }) => {
          if (!text) return this.setState({ getTextLoading: false });
          const groupIndex = canvas
            .toObject()
            .objects.findIndex((group) => group.uniqueId === groupId);
          canvas.item(groupIndex).item(1).set({ text });
          canvas.renderAll();
          const groups = canvas.toObject().objects;
          this.props.onChange({ groups });
          this.setState({ getTextLoading: false, text, groups });
        })
        .catch((err) => {
          this.setState({ getTextLoading: false });
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

  onFontFamilyChange = (fontFamily) => {
    canvas.getActiveObject().item(1).set("fontFamily", fontFamily);
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    this.setState({ groups, fontFamily });
    this.props.onChange({ groups });
    //    const myfont = new FontFaceObserver(fontFamily);
    //    myfont
    //      .load()
    //      .then(() => {
    //        // when font is loaded, use it.
    //        canvas.getActiveObject().item(1).set("fontFamily", fontFamily);
    //        canvas.renderAll();
    //        const groups = canvas.toObject().objects;
    //        this.setState({ groups });
    //        this.props.onChange({ groups });
    //      })
    //      .catch((e) => {
    //        console.log(e);
    //      });
  };
  onFontSizeChange = (value) => {
    canvas
      .getActiveObject()
      .item(1)
      .set({ fontSize: parseInt(value) || 12 });
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    this.setState({ groups, fontSize: parseInt(value), groups });
    this.props.onChange({ groups });
  };

  toggleFontWeight = () => {
    const stateUpdate = {};
    if (this.state.fontWeightStatus === "bold") {
      stateUpdate.fontWeightStatus = FONT_WEIGHT_BUTTONS.normal;
      canvas.getActiveObject().item(1).set({ fontWeight: "normal" });
    } else {
      stateUpdate.fontWeightStatus = FONT_WEIGHT_BUTTONS.bold;
      canvas.getActiveObject().item(1).set({ fontWeight: "bold" });
    }
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    stateUpdate.groups = groups;
    this.setState(stateUpdate);
    this.props.onChange({ groups });
  };

  toggleTextDecoration = () => {
    const stateUpdate = {};
    if (this.state.textDecorationStatus === "underline") {
      stateUpdate.textDecorationStatus = TEXT_DECORATION_BUTTONS.normal;
      canvas.getActiveObject().item(1).set({ textDecoration: "normal" });
    } else {
      stateUpdate.textDecorationStatus = TEXT_DECORATION_BUTTONS.underline;
      canvas.getActiveObject().item(1).set({ textDecoration: "underline" });
    }
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    stateUpdate.groups = groups;
    this.setState(stateUpdate);
    this.props.onChange({ groups });
  };

  toggleFontStyle = () => {
    const stateUpdate = {};
    if (this.state.fontStyleStatus === "italic") {
      stateUpdate.fontStyleStatus = FONT_STYLE_BUTTONS.normal;
      canvas.getActiveObject().item(1).set({ fontStyle: "normal" });
    } else {
      stateUpdate.fontStyleStatus = FONT_STYLE_BUTTONS.italic;
      canvas.getActiveObject().item(1).set({ fontStyle: "italic" });
    }
    canvas.renderAll();
    const groups = canvas.toObject().objects;
    stateUpdate.groups = groups;
    this.setState(stateUpdate);
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
      selectedGroupIndex: i,
      fontSize: ao.item(1).get("fontSize"),
      selectedTextColor: ao.item(1).fill,
      selectedBackgroundColor: ao.item(0).fill,
    });
  };

  onDeleteBoxClick = () => {
    this.setState({ isDeleteShapeModalOpen: true });
  };

  onSelectionClick = () => {
    this.onSelectionStart();
  };

  onSelectionStart = () => {
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

  onDuplicateObject = () => {
    if (canvas.getActiveObject()) {
      fabric.util.enlivenObjects(
        [canvas.getActiveObject().toObject()],
        function (objects) {
          objects.forEach((o) => {
            o.set("top", o.top + 15);
            o.set("left", o.left + 15);
            o.set("uniqueId", uuidv4());
            o.toObject = (function (toObject) {
              return function () {
                return fabric.util.object.extend(toObject.call(this), {
                  uniqueId: this.uniqueId,
                });
              };
            })(o.toObject);
            canvas.add(o);
          });
        }
      );
      canvas.renderAll();
      const groups = canvas.toObject().objects;
      this.props.onChange({ groups });
      this.setState({ groups });
    }
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
    const { selectedGroupIndex } = this.state;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <div className="tools-container">
              <div className="shapes-container">
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
                  circular
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
                {this.state.selectedGroupId && (
                  <Button fluid onClick={this.onDuplicateObject}>
                    Duplicate
                  </Button>
                )}
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="image-container">
              <canvas id="canvas"></canvas>
            </div>
            {this.props.belowImageContent || ""}
            {this.props.originalText && this.props.originalText.length > 0 && (
              <div style={{ margin: "2rem", marginLeft: 0 }}>
                <strong>Original Text:</strong>
                <p>{this.props.originalText[this.state.selectedGroupIndex]}</p>
              </div>
            )}
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
                                    <strong>Font Family:</strong>
                                  </Grid.Column>
                                  <Grid.Column width={10}>
                                    <Dropdown
                                      options={FONTS_OPTIONS.map((o) => ({
                                        text: o,
                                        value: o,
                                      }))}
                                      value={this.state.fontFamily}
                                      onChange={(e, { value }) =>
                                        this.onFontFamilyChange(value)
                                      }
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
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
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
                                      {renderPopup(
                                        <Button
                                          icon="eye dropper"
                                          loading={
                                            this.state.eyeDropperMode ===
                                              "text" &&
                                            this.state.eyeDropperLoading
                                          }
                                          disabled={
                                            this.state.eyeDropperMode ===
                                              "text" &&
                                            this.state.eyeDropperLoading
                                          }
                                          onClick={() => {
                                            if (
                                              this.state.eyeDropperMode ===
                                              "text"
                                            ) {
                                              return this.setState({
                                                eyeDropperMode: "",
                                              });
                                            }
                                            this.setState({
                                              eyeDropperMode: "text",
                                            });
                                          }}
                                          primary={
                                            this.state.eyeDropperMode === "text"
                                          }
                                          basic
                                          size="tiny"
                                        />,

                                        "Pick Color from picture"
                                      )}
                                    </div>
                                  </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                  <Grid.Column width={6}>
                                    Background Color:
                                  </Grid.Column>
                                  <Grid.Column width={10}>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
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
                                      {renderPopup(
                                        <Button
                                          icon="eye dropper"
                                          loading={
                                            this.state.eyeDropperMode ===
                                              "background" &&
                                            this.state.eyeDropperLoading
                                          }
                                          disabled={
                                            this.state.eyeDropperMode ===
                                              "background" &&
                                            this.state.eyeDropperLoading
                                          }
                                          onClick={() => {
                                            if (
                                              this.state.eyeDropperMode ===
                                              "background"
                                            ) {
                                              return this.setState({
                                                eyeDropperMode: "",
                                              });
                                            }
                                            this.setState({
                                              eyeDropperMode: "background",
                                            });
                                          }}
                                          primary={
                                            this.state.eyeDropperMode ===
                                            "background"
                                          }
                                          basic
                                          size="tiny"
                                        />,

                                        "Pick color from picture"
                                      )}
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
                <React.Fragment>Nothing selected</React.Fragment>
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
                  key={group.uniqueId}
                  onClick={() => {
                    this.onBoxSelected(i);
                  }}
                >
                  <div>Box {i + 1}</div>
                  {this.state.selectedGroupId === group.uniqueId && (
                    <div>
                      <Button
                        size="mini"
                        color="red"
                        icon="trash"
                        onClick={this.onDeleteBoxClick}
                      />
                    </div>
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
