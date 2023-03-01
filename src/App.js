import "./index.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp } from "@fortawesome/free-solid-svg-icons";
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      custodian: "",
      showCustodian: false,
      uploading: false,
      progress: 0,
    };
  }
  handleFileSelect = (e) => {
    const files = e.target.files || e.dataTransfer.files;
    const newFiles = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      status: "queued",
    }));
    this.setState({
      files: [...newFiles, ...this.state.files],
      showCustodian: true,
    });
  };
  handleCustodianChange = (e) => {
    this.setState({ custodian: e.target.value });
  };
  handleFileDelete = (fileToDelete) => {
    const remainingFiles = this.state.files.filter(
      (file) => file !== fileToDelete
    );
    this.setState({ files: remainingFiles });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.custodian.trim() === "") {
      alert("Please enter a custodian name.");
      return;
    }
    this.setState({ uploading: true });
    const totalFiles = this.state.files.length;
    let temp = [...this.state.files];
    let completedFiles = 0;
    const updateProgress = () => {
      completedFiles++;
      const progress = Math.round((completedFiles / totalFiles) * 100);
      let remainArray = this.state.files.filter((_x) => !temp.includes(_x));
      let newState = { progress };
      if (progress === 100) {
        newState.files = remainArray;
        newState.custodian = "";
        newState.uploading = false;
      }
      this.setState(newState);
    };
    this.state.files.forEach((file) => {
      if (file.status === "queued") {
        file.status = "uploading";
        setTimeout(() => {
          let completedFiles = this.state.files.filter(
            (_x) => _x.status === "completed"
          ).length;
          updateProgress(file, completedFiles);
        }, Math.random() * 10000 + 1000);
      }
    });
    this.setState({ custodian: "" });
  };
  render() {
    const { files, custodian, showCustodian, uploading, progress } = this.state;
    return (
      <div className="container">
        <div
          className="dropzone"
          onClick={() => document.getElementById("fileInput").click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleFileSelect(e);
          }}
        >
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <div>
              <FontAwesomeIcon icon={faFileArrowUp} className="mr-2 dropbox" />
            </div>
            <div className="mb-0">
              Drag and drop files here or click to select files
            </div>
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={this.handleFileSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <br />
        {showCustodian && (
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="custodian"
                placeholder="Enter Custodian Name"
                className="form-control"
                value={custodian}
                onChange={this.handleCustodianChange}
              />
            </div>
            <br />
            <button type="submit" className="btn btn-dark">
              {uploading ? (
                <span
                  className="spinner-border spinner-border-sm mr-2 btn-lg"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <span></span>
              )}
              Upload
            </button>
          </form>
        )}
        {files.length > 0 && (
          <table className="table table-borderless">
            <tbody>
              {files.map((file) => (
                <tr key={file.name}>
                  <td>{file.name}</td>
                  <td>
                    {file.status === "uploading" && (
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${file.progress}%` }}
                        aria-valuenow={file.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {file.progress}%
                      </div>
                    )}
                  </td>
                  <td>
                    {file.status === "queued" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => this.handleFileDelete(file)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <br />
        {uploading && (
          <>
            <h4>Total Files Progress</h4>
            <div className="progress mb-3">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progress}%
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}
export default App;
