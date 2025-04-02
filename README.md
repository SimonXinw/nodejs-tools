# node-script

可以用 node.js 跑起来的一些脚本，excle 转换、json 转换、图片数据转换等

## git proxy

### clash

git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.7890

### veee

git config --global http.proxy http://127.0.0.1:15236
git config --global https.proxy https://127.0.0.1:15236

# 清除

git config --global --unset http.proxy
git config --global --unset https.proxy

> git config --global -l

# add github or vercel preview branch.

dev or staging evolement.

# debugger

choco install ngrok

ngrok config add-authtoken xxxxxxxxx

ngrok http http://localhost:3000

then use the ngrok domain url to accesse website now.

fddds
