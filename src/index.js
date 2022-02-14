import './sass/main.scss';
import fetchContent from './partials/fetchContent';
import { handlebars } from 'hbs';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const elements = {
  searchButton: document.querySelector('.search-form button'),
  inputSearch: document.querySelector('.search-form input'),
  loadmoreButton: document.querySelector('.load-more'),
};

//          smooth scroll

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
