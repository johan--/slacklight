import _ from 'lodash';
import request from 'superagent';
import swig from 'swig';
import PhotoStore from '../lib/stores/photo-store';
import Slacklight from './slacklight.js';

window.slacklight = (() => {
  let init = () => {
    addClickHandlersForClass("menu-icon", showContent);
    addClickHandlersForClass("ig-image", showLightbox);
    addModalHideHandlers();
    addModalNavHandlers();
  }
  let addModalNavHandlers = () => {
    let prev = document.getElementsByClassName('prev-nav-image')[0];
    let next = document.getElementsByClassName('next-nav-image')[0];
    prev.addEventListener('click', changeContent, false);
    next.addEventListener('click', changeContent, false);
  }

  let changeContent = (e) => {
    let targetImageIndex = e.currentTarget.getAttribute('data');
    let photo = window.__allPhotos[targetImageIndex];
    setPhoto(photo);
    setPhotoTitle(photo);
    setNavIndexes(parseFloat(targetImageIndex))
  }

  let addModalHideHandlers = () => {
    let lightbox = document.getElementsByClassName('modal')[0];
    let closeIcon = document.getElementById('close-icon');
    closeIcon.addEventListener('click', closeModal, false);
    lightbox.addEventListener('click', toggleModal, false);
  }

  let closeModal = (e) => {
    let lightbox = document.getElementsByClassName('modal')[0];
    lightbox.classList.remove("visible");
  }

  let toggleModal = (e) => {
    if (!e || !e.target.closest('.content')) {
      let lightbox = document.getElementsByClassName('modal')[0];
      lightbox.classList.toggle("visible");
    }
  }

  let addClickHandlersForClass = (className, fn) => {
    let els = document.getElementsByClassName(className);
    addHandler("click", els, fn)
  }

  let addHandler = (type, collection, fn) => {
    for (var i = 0; i < collection.length; i++) {
      collection[i].addEventListener(type, fn, false);
    }
  }

  let showContent = (e) => {
    let contentId = e.currentTarget.getAttribute('data')
    let content = document.getElementById(contentId);
    content.classList.toggle("invisible");
  }

  let setPhoto = (photo) => {
    let modalImage = document.getElementsByClassName('modal-image')[0];
    modalImage.setAttribute('src', photo.images)
  }

  let setPhotoTitle = (photo) => {
    let title = document.getElementById('post-title');
    title.innerHTML = photo.caption;
  }

  let setNavIndexes = (index) => {
    let prevNav = document.getElementsByClassName('prev-nav-image')[0];
    let nextNav = document.getElementsByClassName('next-nav-image')[0];
    let indexPair = Slacklight.indexPairs(window.__allPhotos, index);
    prevNav.setAttribute('data', indexPair.prev)
    nextNav.setAttribute('data', indexPair.next)
  }

  let showLightbox = (e) => {
    toggleModal();
    let imageId = e.currentTarget.getAttribute('data')
    let photo = _.find(window.__allPhotos, {id: imageId})
    let photoIndex = _.findIndex(window.__allPhotos, {id: imageId})
    setPhoto(photo)
    setPhotoTitle(photo)
    setNavIndexes(photoIndex)
  }

  window.addEventListener('load', init, false);
}())
