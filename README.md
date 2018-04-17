# Webpack calculates different `chunkhash` on different machines

We found that on different machines `chunkhash` gives different values. It's a really important problem because our project has a few front-end servers and when we use load balancer sometimes our users just can't reach required assets.

This problem appears for a few specific files. Mostly on them and sometimes on other files. Without any obvious logic.

I could extract an example. It's just a one of them. This case is reproducable when we use `expose-loader`, but `expose-loader` actually is not a cause of this case. It's just a one of some examples.

Probably it will help to debug and find a reason why it happens.

### Quick start

```
git clone git@github.com:the-blog/WebpackChunkhashIssue.git

cd WebpackChunkhashIssue

yarn install

yarn build

ls -a public/assets | sort
```

### How to reproduce

**index.js**

```js
require('expose-loader?$!expose-loader?jQuery!node_modules/jquery/dist/jquery.js')
```

```
yarn build
```

```
ls -a public/assets | sort
```

**For MAC**


```
262330 bites

main-346463b8e9a65104ac23.js | MD5 d8c2b3b46248c3f123c9ecea596a6d09
```

**For Linux**

```
CentOS Linux release 7.4.1708 (Core)
NAME="CentOS Linux"
VERSION="7 (Core)"
```

```
262330 bites

main-65a9a525196b42d87983.js | MD5 d8c2b3b46248c3f123c9ecea596a6d09
```

======

```
DISTRIB_DESCRIPTION="Ubuntu 16.04.3 LTS"
NAME="Ubuntu"
VERSION="16.04.3 LTS (Xenial Xerus)"
```

```
262330 bites

main-bb20cb76ef5e75216eb8.js | MD5 d8c2b3b46248c3f123c9ecea596a6d09
```

=====

```
Debian based:

main-dd874969c39e5cf54bce.js | MD5 d8c2b3b46248c3f123c9ecea596a6d09
```

=====

```
Another MAC:

main-d6113094b587ee14e33a.js | MD5 d8c2b3b46248c3f123c9ecea596a6d09
```

### When it works fine

**index.js**

```
require('expose-loader?$!node_modules/jquery/dist/jquery.js')
```

```
yarn build
```

**For MAC**

`262003 bites`

`main-231993cf39ff54f7a509.js`

**For Linux**

`262003 bites`

`main-231993cf39ff54f7a509.js`

### How to Debug

1. Open Chrome `chrome://inspect`
2. `yarn debug`
3. Remote Targe: click `Inspect` link

### The Issue

**Good Case**

```
require('node_modules/jquery/dist/jquery.js')

module: {
  rules: [{
    test: /jquery\.js$/,
    use: [{
      loader: 'expose-loader',
      options: 'jQuery'
    }]
  }]
}
```

```
module.exports = global["jQuery"] = require("-!./jquery.js");
```

**Bad Case**

```js
require('node_modules/jquery/dist/jquery.js')

module: {
  rules: [{
    test: /jquery\.js$/,
    use: [{
      loader: 'expose-loader',
      options: 'jQuery'
    },{
      loader: 'expose-loader',
      options: '$'
    }]
  }]
}
```

```js
module.exports = global["jQuery"] = require("-![ABSOLUTE_PATH]/expose-loader/index.js?$!./jquery.js");
module.exports = global["$"] = require("-!./jquery.js");
```

<img width="100%" src="https://user-images.githubusercontent.com/496713/38870389-53aea5a8-4256-11e8-80a8-97f7d29fb0db.png">
