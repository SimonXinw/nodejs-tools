const updateUrlParams = (paramsObj) => {
  if (typeof window === "undefined") return;
  if (!paramsObj || typeof paramsObj !== "object") return;
  try {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (key && value !== void 0 && value !== null) {
        params.set(key, String(value));
      }
    });
    const newUrl = `${url.origin}${url.pathname}?${params.toString()}${url.hash}`;
    window.history.replaceState(null, "", newUrl);
  } catch (error) {
    console.error("Error updating URL parameters:", error);
  }
};
export {
  updateUrlParams
};
