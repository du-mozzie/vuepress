---
title: Vue
date: 2022-2-22
categories:
 - Bug
tags:
 - Bug
---
## 静态资源引入

### vue图片引入的三种方式

>   图片放在 assets目录下 和static 目录下

##### 1. 在template 中直接固定的引入

```vue
<img src="../assets/logo.png">
```

##### 2. 把图片放static 目录,直接通过data引入

```vue
// template
<img v-bind:src=imgSrc>
// srcipt
export default {
  data () {
    return {
      imgSrc: '../static/launch.png'
    };
  }
};
```

##### 3. 如果放在其它目录,直接通过data引入,则需要如下引入

```vue
require('../assets/launch.png')` 或者 `import logo from '../assets/logo.png'
// template
<img v-bind:src=imgSrc>
// srcipt
export default {
  data () {
    return {
      imgSrc: require('../assets/launch.png')
    };
  }
};
import logo from '../assets/logo.png
// template
<img v-bind:src=imgSrc>
// srcipt
export default {
  data () {
    return {
      imgSrc: logo
    };
  }
};
```
