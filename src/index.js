import './sass/main.scss';
import { FetchContent } from './partials/fetchContent';
import { LoadMoreBnt } from './partials/loadMoreBtn';
import imgCard from './partials/img-card.hbs';

import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { options } from './partials/fetchOptions';
import throttle from 'lodash.throttle';

let isPageLoaded = true;
let last_known_scroll_position = 0;
let i = 0;

const elements = {
  searchButton: document.querySelector('.search-form button'),
  searchForm: document.querySelector('.search-form'),
  inputSearch: document.querySelector('.search-form input'),
  galleryContainer: document.querySelector('.gallery'),
};

const fetchContent = new FetchContent(options);
const loadMorebtn = new LoadMoreBnt('.load-more');
const simpleLightbox = new SimpleLightbox('.gallery a');

loadMorebtn.btnEl.addEventListener('click', onLoadMoreClick);

elements.searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  document.addEventListener('scroll', onScroll);

  elements.galleryContainer.innerHTML = '';
  event.preventDefault();
  let inputValue = event.currentTarget.elements.searchQuery.value;

  if (!isPageLoaded || !inputValue) return;

  isPageLoaded = false;
  const codeWords = inputValue.split(' ');

  fetchContent
    .getPictures(codeWords, getPicPerPage())
    .then(respondProcessing)
    .finally(function () {
      isPageLoaded = true;
    });
}

function getPicPerPage() {
  const windowWidth = window.screen.width;
  const picPerHeight = parseInt(window.screen.height / 210);

  if (windowWidth / 4 > 260) {
    return {
      picPerPage: (picPerHeight + 2) * 4,
      picPerLine: 4,
    };
  }

  if (windowWidth / 3 > 260) {
    return {
      picPerPage: (picPerHeight + 2) * 3,
      picPerLine: 3,
    };
  }

  if (windowWidth / 2 > 260) {
    return {
      picPerPage: (picPerHeight + 2) * 2,
      picPerLine: 2,
    };
  }

  return {
    picPerPage: picPerHeight + 2,
    picPerLine: 1,
  };
}

function respondProcessing({ data }) {
  if (data.hits.length === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  if (fetchContent.pageNo === 1) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    loadMorebtn.turnOn();
  }

  if (fetchContent.pageNo * fetchContent.picPerPage >= data.totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    document.removeEventListener('scroll', onScroll);
    fetchContent.pageNo = 0;
    loadMorebtn.turnOff();
    elements.searchForm.reset();
  }
  sectionRender(data);
  simpleLightbox.refresh();
}

function onLoadMoreClick() {
  fetchContent
    .getPictures('', {})
    .then(respondProcessing)
    .finally((isPageLoaded = true));
}

function sectionRender({ hits }) {
  elements.galleryContainer.insertAdjacentHTML('beforeend', imgCard(hits));
}
//          infinit scroll
function onScroll(evt) {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  if (scrollY - last_known_scroll_position > cardHeight * 2) {
    last_known_scroll_position = scrollY;

    fetchContent
      .getPictures('', { picPerPage: getPicPerPage().picPerLine * 2 })
      .then(respondProcessing);
  }
}
