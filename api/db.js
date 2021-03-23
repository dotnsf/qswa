//. db.js(シンプル・メモリDB)
var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    router = express();
var settings = require( '../settings' );

//. メモリデータストアを有効にする
if( settings.memdb ){
  router._docs = {};
}

//. POST メソッドで JSON データを受け取れるようにする
router.use( bodyParser.urlencoded( { extended: true } ) );
router.use( bodyParser.json() );

//. 新規作成用関数
router.createDoc = function( doc ){
  if( !doc.id ){
    doc.id = generateId();
  }
  if( typeof doc.id == 'integer' ){
    doc.id = '' + doc.id;
  }
  if( router._docs[doc.id] ){
    return { status: 400, error: 'doc id = ' + doc.id + ' existed.' };
  }else{
    var ts = timestamp2datetime( ( new Date() ).getTime() );
    doc.created = ts;
    doc.updated = ts;
    router._docs[doc.id] = doc;
    return { status: 200, doc: doc };
  }
};

//. １件取得用関数
router.getDoc = function( id ){
  if( id ){
    if( router._docs[id] ){
      return { status: 200, doc: router._docs[id] };
    }else{
      return { status: 400, error: 'doc id = ' + id + ' not found.' };
    }
  }else{
    return { status: 400, error: 'parameter id needed.' };
  }
};

//. 複数件取得用関数
router.getDocs = function( limit, offset ){
  var docs = [];
  Object.keys( router._docs ).forEach( function( id ){
    docs.push( router._docs[id] );
  });

  offset = ( offset ? offset : 0 );
  if( limit ){
    docs = docs.slice( offset, offset + limit );
  }else if( offset ){
    docs = docs.slice( offset );
  }

  return { status: 200, limit: limit, offset: offset, docs: docs };
}

//. １件更新用関数
router.updateDoc = function( doc ){
  if( !doc.id ){
    return { status: 400, error: 'parameter id needed.' };
  }else{
    if( router._docs[doc.id] ){
      var old_doc = router._docs[doc.id];
      var ts = timestamp2datetime( ( new Date() ).getTime() );
      doc.created = old_doc.created;
      doc.updated = ts;
      router._docs[doc.id] = doc;
      return { status: 200, doc: doc };
    }else{
      return { status: 400, error: 'doc id = ' + doc.id + ' not found.' };
    }
  }
};

//. １件削除用関数
router.deleteDoc = function( id ){
  if( !id ){
    return { status: 400, error: 'parameter id needed.' };
  }else{
    if( router._docs[id] ){
      delete router._docs[id];
      return { status: 200 };
    }else{
      return { status: 400, error: 'doc id = ' + id + ' not found.' };
    }
  }
};

//. リセット関数
router.deleteDocs = function(){
  router._docs = {};
  return { status: 200 };
};

//. POST /db/doc
router.post( '/doc', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  if( req.body ){
    var params = req.body;

    var r = router.createDoc( params );
    res.status( r.status );
    res.write( JSON.stringify( r, null, 2 ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: 400, error: 'no object found.' } ) );
    res.end();
  }
});

//. GET /db/doc/:id
router.get( '/doc/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id;
  if( id ){
    var r = router.getDoc( id );
    res.status( r.status );
    res.write( JSON.stringify( r, null, 2 ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: 400, error: 'no parameter id found.' } ) );
    res.end();
  }
});

//. GET /db/docs
router.get( '/docs', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var limit = ( req.query.limit ? parseInt( req.query.limit ) : 0 );
  var offset = ( req.query.offset ? parseInt( req.query.offset ) : 0 );

  var r = router.getDocs( limit, offset );
  res.status( r.status );
  res.write( JSON.stringify( r, null, 2 ) );
  res.end();
});

//. PUT /db/doc/:id
router.put( '/doc/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id;
  if( id ){
    if( req.body ){
      var doc = req.body;
      doc.id = id;

      var r = router.updateDoc( doc );
      res.status( r.status );
      res.write( JSON.stringify( r, null, 2 ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: 400, error: 'no object found.' } ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: 400, error: 'no parameter id found.' } ) );
    res.end();
  }
});

//. DELETE /db/doc/:id
router.delete( '/doc/:id', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var id = req.params.id;
  if( id ){
    var r = router.deleteDoc( id );
    res.status( r.status );
    res.write( JSON.stringify( r, null, 2 ) );
    res.end();
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: 400, error: 'no parameter id found.' } ) );
    res.end();
  }
});

//. DELETE /db/docs
router.delete( '/docs', function( req, res ){
  res.contentType( 'application/json; charset=utf-8' );

  var r = router.deleteDocs();
  res.status( r.status );
  res.write( JSON.stringify( r, null, 2 ) );
  res.end();
});

//. ID作成用関数
function generateId(){
  var s = 1000;
  var id = '' + ( new Date().getTime().toString(16) ) + Math.floor( s * Math.random() ).toString(16);

  return id;
}

//. タイムスタンプ->日付時刻文字列
function timestamp2datetime( ts ){
  if( !ts ){ ts = 0; }
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
}

//. router をエクスポート
module.exports = router;
