import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import { saveAs } from "file-saver";

const Editor = () => {
  const [state, setState] = useState({
    imageWidth: 500,
    imageHeight: 400,
    imageBackground: "#cccccc",
    type: "",
  });

  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const can = new fabric.Canvas("canvas", {
      width: state.imageWidth,
      height: state.imageHeight,
      backgroundColor: state.imageBackground,
    });
    setCanvas(can);

    return () => {};
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", ({ target }) => {
        setState({ ...state, type: target.type });
      });
      canvas.on("selection:updated", ({ target }) => {
        setState({ ...state, type: target.type });
      });
      canvas.on("mouse:down", ({ target }) => {
        console.log("mounse down");
        setState({ ...state, type: target?.type });
      });
    }
    return () => {};
  }, [canvas]);

  const addRectangle = () => {
    var rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 120,
      height: 70,
      fill: "yellow",
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };
  const removeItem = () => {
    canvas.remove(canvas.getActiveObject());
    if (canvas.getObjects()[0]) {
      canvas.setActiveObject(canvas.getObjects()[0]);
    }
  };

  // clear canvas
  const removeAll = () => {
    canvas.clear();
  };

  /**
   * Canvas features
   */
  const canvasBackgroundChange = (e) => {
    canvas.setBackgroundColor(e.target.value);
    setState({ ...state, backgroundColor: e.target.value });
    canvas.renderAll();
  };

  const canvasWidthChange = (e) => {
    canvas.setWidth(e.target.value);
    setState({ ...state, imageWidth: e.target.value });
  };
  const canvasHeightChange = (e) => {
    canvas.setHeight(e.target.value);
    setState({ ...state, imageHeight: e.target.value });
  };

  /***** Items Features */
  const handleChange = (e) => {
    canvas.getActiveObject().set(e.target.name, e.target.value);
    canvas.renderAll();
  };

  const reRender = () => {
    canvas.renderAll();
    canvas.renderTop();
  };

  const addText = () => {
    var text = new fabric.Textbox("New Text", {
      top: 100,
      left: 100,
      width: 120,
      height: 70,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const fontSizeChange = (e) => {
    canvas.getActiveObject().set("fontSize", e.target.value);
    reRender();
  };
  const download = () => {
    const image = canvas.toDataURL({ format: "jpeg" });
    // window.open(image, "", "width=500,height=400");
    saveAs(image, "final-work.jpeg");
  };

  const addImage = (e) => {
    var _URL = window.URL || window.webkitURL;
    var file, img;
    if ((file = e.target.files[0])) {
      img = new Image();
      img.onload = function () {
        // alert(this.width + " " + this.height);

        var imgInstance = new fabric.Image(img, {
          angle: 0,
          left: 100,
          top: 100,
          width: img.width,
          heigth: img.height,
          scaleX: canvas.height / img.width,
          scaleY: canvas.height / img.width,
          opacity: 1,
        });
        canvas.add(imgInstance);
        canvas.renderAll();
        canvas.setActiveObject(imgInstance);
      };
      img.onerror = function () {
        alert("not a valid file: " + file.type);
      };
      img.src = _URL.createObjectURL(file);
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-sm-8">
          <canvas id="canvas"></canvas>
          <img
            style={{ display: "none", maxHeight: 300 }}
            src=""
            id="my-image"
            alt=""
          />
        </div>
        <div className="col-sm-4">
          <h5>Add Items</h5>

          <button
            className="btn btn-secondary mr-1"
            onClick={() => addRectangle()}
          >
            Add Rectangle
          </button>
          <button className="btn btn-primary mr-1" onClick={() => addText()}>
            Add Text
          </button>
          <input
            type="file"
            accept="image/*"
            className="btn mr-1 mt-1"
            onChange={addImage}
          />

          <div className="mt-2">
            <div id="text-controls">
              <div className="my-4">
                <div className="row">
                  <div className="col-12">
                    <h4>Image Size</h4>
                  </div>
                  <div className="col-3">
                    <input
                      type="number"
                      min="200"
                      value={state.imageWidth}
                      className="form-control"
                      max="700"
                      onChange={canvasWidthChange}
                    />
                  </div>
                  <div className="col-3">
                    <input
                      type="number"
                      value={state.imageHeight}
                      className="form-control"
                      min="200"
                      max="700"
                      onChange={canvasHeightChange}
                    />
                  </div>
                </div>
                <br />

                <label
                  htmlFor="canvas-color"
                  style={{ display: "inline-block" }}
                >
                  Image Background Color:
                </label>
                <input
                  type="color"
                  id="canvas-color"
                  value={state.imageBackground}
                  onChange={canvasBackgroundChange}
                />
                <br />
              </div>

              <label htmlFor="text-color" style={{ display: "inline-block" }}>
                {state.type == "rect" ? "Background " : ""} Color:
              </label>
              <input
                type="color"
                id="text-color"
                name="fill"
                onChange={handleChange}
              />
              {state.type == "textbox" ? (
                <>
                  <br />
                  <label
                    htmlFor="font-family"
                    style={{ display: "inline-block" }}
                  >
                    Font family:
                  </label>
                  <select onChange={handleChange} name="fontFamily">
                    <option value="arial">Arial</option>
                    <option value="helvetica">Helvetica</option>
                  </select>
                  <br />
                  <label
                    htmlFor="text-align"
                    name="textAlign"
                    onChange={handleChange}
                    style={{ display: "inline-block" }}
                  >
                    Text align:
                  </label>
                  <select onChange={handleChange} name="textAlign">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                  <div>
                    <label htmlFor="text-bg-color">Background color:</label>
                    <input
                      type="color"
                      name="backgroundColor"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="text-font-size">Font size:</label>
                    <input
                      type="range"
                      min="1"
                      max="120"
                      onChange={fontSizeChange}
                      step="1"
                      name="fontSize"
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="mt-5">
            <button
              className="btn btn-danger mr-1 "
              onClick={() => removeItem()}
            >
              Remove Active
            </button>

            <button
              className="btn btn-success  mr-1"
              onClick={() => download()}
            >
              Download work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
