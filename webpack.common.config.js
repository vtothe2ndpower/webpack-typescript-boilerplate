const path = require( "path" );
const webpack = require( 'webpack' );
const autoprefixer = require( 'autoprefixer' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const ENV = process.env.NODE_ENV;
const ENV_msg = ENV === 'prod' ? 'PRODUCTION' : ( ENV === 'dev' ? 'DEVELOPMENT' : 'TEST');
console.log( `--------------------------------------------------------------------------------------------------------------------` );
console.log( `----------------------------------------------------- ${ENV_msg} ---------------------------------------------------` );
console.log( `--------------------------------------------------------------------------------------------------------------------` );

module.exports = function () {
  return {
    context: path.resolve( __dirname, "src/app" ),

    entry: {
      index: [ "./index.ts" ],
      about: [ "./about.ts" ],
      vendor: [ "moment", "jquery", "lodash", "rxjs" ],
      bootstrap: [ 'bootstrap-loader' ]
    },

    output: {
      path: path.resolve( __dirname, "build" ),
      publicPath: '/',
      filename: "js/[name].[chunkhash].js"
    },

    resolve: {
      extensions: [ '.ts', '.js', '.json', '.css', '.less', '.html', '.hbs' ]
    },

    module: {
      noParse: /\/node_modules\/(jquery|lodash|moment)/,
      rules: [
        {
          test: /\.hbs$/,
          loaders: [ 'handlebars-loader' ]
        },
        {
          test: /\.ts$/,
          loaders: [ 'awesome-typescript-loader' ],
          include: path.resolve( __dirname, "src/app" )
        },
        {
          test: /\.ts$/,
          enforce: 'pre',
          loader: 'tslint-loader',
          options: {
            configFile: 'tslint.json',
            tsConfigFile: 'tsconfig.json'
          }
        },
        {
          test: /\.css$/,
          exclude: [
            path.resolve( __dirname, "src/public/font/font-awesome" ),
          ],
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: true, importLoaders: 1 }
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.less$/,
          exclude: [
            path.resolve( __dirname, "src/public/font/font-awesome" ),
          ],
          use: ExtractTextPlugin.extract( {
            fallbackLoader: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: { sourceMap: true, importLoaders: 1 }
              },
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true,
                  map: true,
                  plugins: function () {
                    return [
                      require( 'autoprefixer' )
                    ];
                  }
                }
              },
              {
                loader: 'less-loader',
                options: { sourceMap: true }
              },
            ]
          } )
        }
      ]
    },

    plugins: [
      new HtmlWebpackPlugin( {
        filename: 'index.html',
        chunks: [ "common", "vendor", "bootstrap", "manifest", "index" ],
        template: path.join( __dirname, "src/index.hbs" )
      } ),
      new HtmlWebpackPlugin( {
        filename: 'about.html',
        chunks: [ "common", "vendor", "bootstrap", "manifest", "about" ],
        template: path.join( __dirname, "src/about.hbs" )
      } ),
      new ExtractTextPlugin( { filename: "css/[name]-[chunkhash].css", } ),
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.CommonsChunkPlugin( {
        name: [ "common", "vendor", "bootstrap", "manifest" ]
      } ),
      new webpack.DefinePlugin( {
        "process.env": {
          NODE_ENV: JSON.stringify( ENV )
        }
      } ),
      new webpack.ContextReplacementPlugin( /node_modules\/moment\/locale/, /pl|en-gb/ ),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Tether: "tether",
        "window.Tether": "tether",
        Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
        Button: "exports-loader?Button!bootstrap/js/dist/button",
        Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
        Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
        Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
        Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
        Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
        Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
        Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
        Util: "exports-loader?Util!bootstrap/js/dist/util",
      })
    ],

    devtool: "source-map"
  };

};
