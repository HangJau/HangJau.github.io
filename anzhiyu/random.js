var posts=["2024/09/13/shi-yong-jiao-ben/pyhton-sheng-huo-qi-che-piao-yu-piao-jian-kong/","2023/07/09/shi-yong-jiao-ben/python-sheng-huo-ding-shi-fa-song-xin-wen-lian-bo-dao-wei-xin/","2024/09/18/shi-yong-jiao-ben/python-sheng-huo-dang-python-yu-shang-ke-zhuan-zhai/","2023/12/09/jiao-cheng/armbian-xia-an-zhuang-openwrt-docker-ban/","2023/09/23/jiao-cheng/kali-wsl-zi-ding-yi-lu-jing-an-zhuang/","2023/12/16/jiao-cheng/linux-xia-v2ray-ke-hu-duan-an-zhuang/","2023/08/27/jiao-cheng/linux-an-zhuang-docker/","2024/01/26/jiao-cheng/shang-chuan-bao-dao-pypi/","2023/09/03/jiao-cheng/ji-ding-he-bian-fu-wu-qi/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };