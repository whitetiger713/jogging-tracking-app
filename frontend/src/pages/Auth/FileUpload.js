import React, { Component } from 'react';
import axios from 'axios';

class FileUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: '',
    };

    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.fileName.value);
    console.log(data)
    axios.post('http://localhost:8080/user/fileupload', data, {
      headers: { "X-Requested-With": "XMLHttpRequest" },
    }).then((response) => {
      console.log(response.data)
      this.setState({ imageURL: `http://localhost:8080/${response.data.file}` });
    });
  }
  render() {
    return (
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
        </div>
        <div>
          <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
        </div>
        <br />
        <div>
          <button>Upload</button>
        </div>
        <img src={this.state.imageURL} alt="img" />
      </form>
    );
  }
}

export default FileUpload;