import * as koa from 'koa';
import * as webpack from 'webpack';
import Hello from './Hello';
import { renderToString } from 'react-dom/server';
import * as compress from 'koa-compress';
import * as webpackDevMiddleware from 'koa-webpack-dev-middleware';
import * as webpackHotMiddleware from 'koa-webpack-hot-middleware';
import * as config from '../../webpack.config';
const compiler = webpack(config);
const app = new koa();
function renderFullPage(html, initialState) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <div id="root">
          ${html}
      </div>
      <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
      </script>
      <script src="/dist/client.min.js"></script>
    </body>
    </html>
  `;
}
app
// .use(compress())
// .use(webpackDevMiddleware(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath
// }))
// .use(webpackHotMiddleware(compiler))
.use((ctx) => {
  ctx.body = renderFullPage(renderToString(Hello('aa')), {});
})
.listen(3001, () => {
  console.log('server started');
});
