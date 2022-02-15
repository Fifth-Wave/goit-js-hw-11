import './sass/main.scss';
import { FetchContent } from './partials/fetchContent';
import { LoadMoreBnt } from './partials/loadMoreBtn';
import imgCard from './partials/img-card.hbs';

import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { options } from './partials/fetchOptions';

let isPageLoaded = true;

const elements = {
  searchButton: document.querySelector('.search-form button'),
  searchForm: document.querySelector('.search-form'),
  inputSearch: document.querySelector('.search-form input'),
  galleryContainer: document.querySelector('.gallery'),
};

const fetchContent = new FetchContent(options);
const loadMorebtn = new LoadMoreBnt('.load-more');

loadMorebtn.btnEl.addEventListener('click', onLoadMoreClick);

elements.searchForm.addEventListener('submit', onSubmit);

function onSubmit(event) {
  elements.galleryContainer.innerHTML = '';
  event.preventDefault();
  let inputValue = event.currentTarget.elements.searchQuery.value;

  if (!isPageLoaded || !inputValue) return;

  isPageLoaded = false;
  const codeWords = inputValue.split(' ');

  fetchContent
    .getPictures(codeWords)
    .then(respondProcessing)
    .finally(function () {
      isPageLoaded = true;
    });
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
    fetchContent.pageNo = 0;
    loadMorebtn.turnOff();
    elements.searchForm.reset();
  }
  sectionRender(data);
  new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
  // rendering page
}

function onLoadMoreClick() {
  fetchContent
    .getPictures()
    .then(respondProcessing)
    .finally((isPageLoaded = true));
}

function sectionRender({ hits }) {
  elements.galleryContainer.insertAdjacentHTML('beforeend', imgCard(hits));
}
//          smooth scroll

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
