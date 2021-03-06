//. app.js
var express = require( 'express' ),
    ejs = require( 'ejs' ),
    app = express();

//. ルーティング
app.use( express.Router() );

//. スタティックファイル・フォルダの指定
app.use( express.static( __dirname + '/public' ) );

//. EJS テンプレートエンジン
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

//. DB関連機能を定義したファイルを利用
var dbapi = require( './api/db' );
app.use( '/db', dbapi );


//. GET / へのハンドラ
app.get( '/', function( req, res ){
  var r = dbapi.getDocs();
  var docs = ( ( r.status == 200 && r.docs ) ? r.docs : [] );
  res.render( 'docs', { docs: docs } );
});

//. GET /doc/:id へのハンドラ
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

//. GET /edit へのハンドラ
app.get( '/edit', async function( req, res ){
  res.render( 'edit', { doc: null } );
});

app.get( '/edit/:id', async function( req, res ){
  var id = req.params.id;
  if( id ){
    var r = dbapi.getDoc( id );
    if( r.status == 200 && r.doc ){
      res.render( 'edit', { doc: r.doc } );
    }else{
      res.render( 'edit', { doc: null } );
    }
  }else{
    res.render( 'edit', { doc: null } );
  }
});

//. 特定ポート番号で待受
var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
