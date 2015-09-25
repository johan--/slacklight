import _ from 'lodash';
import request from 'superagent';
import swig from 'swig';
import PhotoStore from '../lib/stores/photo-store';
import Slacklight from './slacklight.js';

window.slacklight = (() => {
  let init = () => {
    addClickHandlersForClass("menu-icon", showContent);
    addClickHandlersForClass("ig-image", showLightbox);
    addModalHideHandler();
  }

  let addModalHideHandler = () => {
    let closeIcon = document.getElementById('close-icon');
    closeIcon.addEventListener('click', toggleModal, false);
  }

  let toggleModal = () => {
    let lightbox = document.getElementsByClassName('modal')[0];
    lightbox.classList.toggle("visible");
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
    let menu = e.currentTarget
    let contentId = menu.getAttribute('data');
    let content = document.getElementById(contentId);
    content.classList.toggle("invisible");
  }

  let showLightbox = (e) => {
    toggleModal();
    let img = e.currentTarget
    let imageId = img.getAttribute('data');
    let photo = _.find(window.__allPhotos, {id: imageId})

    // Set Title
    let title = document.getElementById('post-title');
    title.innerHTML = photo.caption;
    // Set Image
    let modalImage = document.getElementsByClassName('modal-image')[0];
    modalImage.setAttribute('src', photo.images)

    // Set toggle indexes
    let photoIndex = _.findIndex(window.__allPhotos, {id: imageId})
    let prevNav = document.getElementsByClassName('prev-nav-image')[0];
    let nextNav = document.getElementsByClassName('next-nav-image')[0];

    let prevIndex;
    let nextIndex;
    if (photoIndex === 0) {
      prevIndex = prevNav.setAttribute('data', window.__allPhotos.length-1)
    } else if (photoIndex === window.__allPhotos.length-1) {
      nextIndex = 0;
    }

    if (prevIndex) {
      prevNav.setAttribute('data', prevIndex)
    } else {
      prevNav.setAttribute('data', photoIndex-1)
    }

    if (nextIndex) {
      nextNav.setAttribute('data', nextIndex)
    } else {
      nextNav.setAttribute('data', photoIndex+1)
    }
  }

  window.addEventListener('load', init, false);
}())
