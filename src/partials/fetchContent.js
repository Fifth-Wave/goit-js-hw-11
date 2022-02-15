import axios from 'axios';

export class FetchContent {
  pageNo = 0;
  keyWords = [];
  picPerPage = 100;

  constructor({ BASE_URL, API_KEY }) {
    this.BASE_URL = BASE_URL;
    this.API_KEY = API_KEY;
  }

  getPictures(keyWords) {
    if (keyWords) {
      this.keyWords = keyWords;

      this.pageNo = 0;
    }

    this.pageNo += 1;
    return axios.get(
      `${this.BASE_URL}/?key=${this.API_KEY}&q=${this.keyWords.join('+')}&image_type=photo&page=${
        this.pageNo
      }&per_page=${this.picPerPage}&orientation=horizontal&safesearch=true`,
    );
  }
}
