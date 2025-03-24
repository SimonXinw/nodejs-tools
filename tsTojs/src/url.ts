export const updateUrlParams = (paramsObj: Record<string, string>) => {
  if (typeof window === 'undefined') return; // 兼容 SSR/Next.js，防止报错
  if (!paramsObj || typeof paramsObj !== 'object') return; // 兼容空值或错误参数类型

  try {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    Object.entries(paramsObj).forEach(([key, value]) => {
      if (key && value !== undefined && value !== null) {
        params.set(key, String(value)); // 确保值是字符串
      }
    });

    // 生成新的 URL，保留 hash 部分
    const newUrl = `${url.origin}${url.pathname}?${params.toString()}${url.hash}`;

    // 使用 history.replaceState 更新 URL，不刷新页面
    window.history.replaceState(null, '', newUrl);
  } catch (error) {
    console.error('Error updating URL parameters:', error);
  }
};
