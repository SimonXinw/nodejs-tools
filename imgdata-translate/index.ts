var img = "http://127.0.0.1/test/images/timg.jpg";
var image = new Image();
image.crossOrigin = "Anonymous"; // 加这句 防止报错跨域问题
image.src = img;
image.onload = function () {
  //文件的Base64字符串
  var base64 = getBase64Image(image);
  // console.log(base64)
  //Base64字符串转二进制
  var file = dataURLtoBlob(base64);

  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = (e) => {
    console.log("reader 读取的事件对象>>>>>>>>>>", e);

    const img: any = new Image();

    img.onload = () => {
      console.log("加载的图片和外面的一样>>>>>>>>>>", img.width, img);
    };
    img.src = reader.result;
  };

  console.log("file", file, "iamge", image?.width);
};

/**
 * 图像转Base64
 */
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  var dataURL = canvas.toDataURL("image/" + ext);
  return dataURL;
}

/**
 *Base64字符串转二进制
 */
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime,
  });
}
