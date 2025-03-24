const scrollToWithOffset = (id) => {
  var el = document.getElementById(id);
  var headerOffset = 90;
  if (el) {
    var elementPosition = el == null ? void 0 : el.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.scrollY - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};
export {
  scrollToWithOffset
};
