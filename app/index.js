import request from 'superagent';
import swig from 'swig';

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
    let lightbox = document.getElementById('lightbox');
    lightbox.classList.toggle("invisible");
    let img = e.currentTarget
    let imageId = menu.getAttribute('data');
    let photo = PhotoStore.get(imageId);

    let lightboxContent = swig.renderFile('../views/lightbox.html', {photo: photo});


    let content = document.getElementById(contentId);
  }

  window.addEventListener('load', init, false);
}())
