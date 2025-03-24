export const scrollToWithOffset = (id: string) => {
  var el = document.getElementById(id);
  var headerOffset = 90;
  if (el) {
    var elementPosition = el?.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.scrollY - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};
