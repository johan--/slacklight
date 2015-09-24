import _ from 'lodash';
import request from 'superagent';
import swig from 'swig';
import PhotoStore from '../lib/stores/photo-store';

window.slacklight = (() => {
  let init = () => {
    addClickHandlersForClass("menu-icon", showContent)
    addClickHandlersForClass("ig-image", showLightbox)
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
    let lightbox = document.getElementsByClassName('modal')[0];
    lightbox.classList.toggle("visible");
    let img = e.currentTarget
    let imageId = img.getAttribute('data');
    let photo = _.find(window.__allPhotos, {id: imageId})

    let title = document.getElementById('post-title');
    title.innerHTML = photo.caption;
  }

  window.addEventListener('load', init, false);
}())
