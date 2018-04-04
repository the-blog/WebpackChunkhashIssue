## Webpack 3. Bug with hashed chunks' names on different machines

We found that on different machines `chunkhash` gives different values. It's a really important problem because our project has a few front-end servers and when we use load balancer sometimes our users just can't reach required assets.

This problem appears for a few specific files. Mostly on them and sometimes on other files. Without any obvious logic.

I could extract an example. It's just a one of them. This case is reproducable when we use `expose-loader`, but `expose-loader` actually is not a cause of this case. It's just a one of some examples.

Probably it will help to debug and find a reason why it happens.

### How to install

```
yarn install
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

`262253 bites`

```
main-8ef023d4a0e16fb9f1bf.js
```

**For LINUX**

`262253 bites`

```
main-2cf321dd8fe096961f6f.js
```
