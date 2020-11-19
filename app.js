//. app.js
var express = require( 'express' ),
    multer = require( 'multer' ),
    bodyParser = require( 'body-parser' ),
    fs = require( 'fs' ),
    ejs = require( 'ejs' ),
    request = require( 'request' ),
    app = express();
var settings = require( './settings' );

app.use( multer( { dest: './tmp/' } ).single( 'image' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( express.Router() );
app.use( express.static( __dirname + '/public' ) );

app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

var dbapi = require( './api/db' );
app.use( '/db', dbapi );

app.get( '/', function( req, res ){
  var r = dbapi.getDocs();
  var docs = ( ( r.status == 200 && r.docs ) ? r.docs : [] );
  res.render( 'docs', { docs: docs } );
});

app.get( '/doc/:id', function( req, res ){
  var id = req.params.id;
  if( id ){
    var r = dbapi.getDoc( id );
    if( r.status == 200 && r.doc ){
      res.render( 'doc', { doc: r.doc } );
    }else{
      res.render( 'doc', { doc: null } );
    }
  }else{
    res.render( 'doc', { doc: null } );
  }
});


function timestamp2datetime( ts ){
  if( ts ){
    var dt = new Date( ts );
    var yyyy = dt.getFullYear();
    var mm = dt.getMonth() + 1;
    var dd = dt.getDate();
    var hh = dt.getHours();
    var nn = dt.getMinutes();
    var ss = dt.getSeconds();
    var datetime = yyyy + '-' + ( mm < 10 ? '0' : '' ) + mm + '-' + ( dd < 10 ? '0' : '' ) + dd
      + ' ' + ( hh < 10 ? '0' : '' ) + hh + ':' + ( nn < 10 ? '0' : '' ) + nn + ':' + ( ss < 10 ? '0' : '' ) + ss;
    return datetime;
  }else{
    return "";
  }
}

var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
